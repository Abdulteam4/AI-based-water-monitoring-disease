import json
import uuid
import io
import pandas as pd
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models import WaterSample, Location, Alert, User
from app.schemas import WaterAnalysisRequest, WaterSampleOut
from app.auth import get_current_user_optional
from app.ml.predictor import predict_water_quality

router = APIRouter(prefix="/water", tags=["Water Analysis"])


def _format_sample_response(sample: WaterSample) -> dict:
    return {
        "id": sample.id,
        "sample_code": sample.sample_code,
        "location_name": sample.location.name if sample.location else "Main Water Supply",
        "ph": sample.ph,
        "hardness": sample.hardness,
        "solids": sample.solids,
        "chloramines": sample.chloramines,
        "sulfate": sample.sulfate,
        "conductivity": sample.conductivity,
        "organic_carbon": sample.organic_carbon,
        "trihalomethanes": sample.trihalomethanes,
        "turbidity": sample.turbidity,
        "dissolved_oxygen": sample.dissolved_oxygen,
        "nitrate": sample.nitrate,
        "lead": sample.lead,
        "water_safety_score": sample.water_safety_score,
        "status": sample.status,
        "risk_level": sample.risk_level,
        "is_potable": sample.is_potable,
        "potability_probability": sample.potability_probability,
        "explanation": json.loads(sample.explanation_json) if sample.explanation_json else {},
        "disease_risks": json.loads(sample.disease_risks_json) if sample.disease_risks_json else {},
        "recommendations": json.loads(sample.recommendations_json) if sample.recommendations_json else [],
        "created_at": sample.created_at
    }


@router.post("/analyze", status_code=status.HTTP_201_CREATED)
def analyze_sample(
    request: WaterAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    params = request.model_dump(exclude={"location_id", "location_name"})
    prediction = predict_water_quality(parameters=params)
    
    sample_code = f"WS-{uuid.uuid4().hex[:8].upper()}"
    
    # Resolve location if ID or name provided
    loc_id = request.location_id
    loc_name = request.location_name or "Main Water Supply"
    if not loc_id and current_user:
        loc = db.query(Location).filter(Location.name == loc_name, Location.user_id == current_user.id).first()
        if not loc:
            loc = Location(name=loc_name, type="General Water Site", user_id=current_user.id)
            db.add(loc)
            db.commit()
            db.refresh(loc)
        loc_id = loc.id
        
    sample = WaterSample(
        sample_code=sample_code,
        location_id=loc_id,
        user_id=current_user.id if current_user else None,
        ph=prediction["parameters"]["ph"],
        hardness=prediction["parameters"]["hardness"],
        solids=prediction["parameters"]["solids"],
        chloramines=prediction["parameters"]["chloramines"],
        sulfate=prediction["parameters"]["sulfate"],
        conductivity=prediction["parameters"]["conductivity"],
        organic_carbon=prediction["parameters"]["organic_carbon"],
        trihalomethanes=prediction["parameters"]["trihalomethanes"],
        turbidity=prediction["parameters"]["turbidity"],
        dissolved_oxygen=prediction["parameters"]["dissolved_oxygen"],
        nitrate=prediction["parameters"]["nitrate"],
        lead=prediction["parameters"]["lead"],
        water_safety_score=prediction["water_safety_score"],
        status=prediction["status"],
        risk_level=prediction["risk_level"],
        is_potable=prediction["is_potable"],
        potability_probability=prediction["potability_probability"],
        explanation_json=json.dumps(prediction["xai"]),
        disease_risks_json=json.dumps(prediction["disease_risks"]),
        recommendations_json=json.dumps(prediction["recommendations"])
    )
    
    db.add(sample)
    db.commit()
    db.refresh(sample)
    
    # Create Alert automatically if risk level is HIGH or CRITICAL
    if prediction["risk_level"] in ["HIGH", "CRITICAL"] or prediction["water_safety_score"] < 65:
        top_driver = prediction["xai"]["top_contributors"][0]["name"] if prediction["xai"]["top_contributors"] else "Water Quality Anomaly"
        alert = Alert(
            sample_id=sample.id,
            location_name=loc_name,
            alert_type="Contamination Risk Alert",
            title=f"Unsafe Water Alert ({prediction['status']})",
            message=f"Sample {sample_code} classified as {prediction['status']} (Score: {prediction['water_safety_score']}/100). Primary driver: {top_driver}.",
            severity=prediction["risk_level"]
        )
        db.add(alert)
        db.commit()
        
    return _format_sample_response(sample)


@router.post("/upload")
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are supported.")
        
    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")
        
    # Map common column aliases to feature names
    col_mapping = {
        "ph": "ph", "hardness": "hardness", "solids": "solids", "tds": "solids",
        "chloramines": "chloramines", "chlorine": "chloramines", "sulfate": "sulfate",
        "conductivity": "conductivity", "organic_carbon": "organic_carbon", "toc": "organic_carbon",
        "trihalomethanes": "trihalomethanes", "thms": "trihalomethanes", "turbidity": "turbidity",
        "dissolved_oxygen": "dissolved_oxygen", "do": "dissolved_oxygen",
        "nitrate": "nitrate", "lead": "lead"
    }
    
    renamed_cols = {}
    for c in df.columns:
        clean_c = str(c).strip().lower()
        if clean_c in col_mapping:
            renamed_cols[c] = col_mapping[clean_c]
            
    df = df.rename(columns=renamed_cols)
    
    if "ph" not in df.columns or "turbidity" not in df.columns:
        raise HTTPException(
            status_code=400,
            detail="Uploaded CSV is missing mandatory parameter columns (e.g. ph, turbidity, solids, chloramines)."
        )
        
    created_samples = []
    
    for _, row in df.iterrows():
        sample_params = {
            "ph": float(row.get("ph", 7.0)),
            "hardness": float(row.get("hardness", 150.0)),
            "solids": float(row.get("solids", 300.0)),
            "chloramines": float(row.get("chloramines", 2.0)),
            "sulfate": float(row.get("sulfate", 150.0)),
            "conductivity": float(row.get("conductivity", 400.0)),
            "organic_carbon": float(row.get("organic_carbon", 3.0)),
            "trihalomethanes": float(row.get("trihalomethanes", 40.0)),
            "turbidity": float(row.get("turbidity", 2.0)),
            "dissolved_oxygen": float(row.get("dissolved_oxygen", 8.0)),
            "nitrate": float(row.get("nitrate", 4.0)),
            "lead": float(row.get("lead", 0.003))
        }
        
        prediction = predict_water_quality(sample_params)
        sample_code = f"WS-CSV-{uuid.uuid4().hex[:6].upper()}"
        
        sample = WaterSample(
            sample_code=sample_code,
            user_id=current_user.id if current_user else None,
            ph=prediction["parameters"]["ph"],
            hardness=prediction["parameters"]["hardness"],
            solids=prediction["parameters"]["solids"],
            chloramines=prediction["parameters"]["chloramines"],
            sulfate=prediction["parameters"]["sulfate"],
            conductivity=prediction["parameters"]["conductivity"],
            organic_carbon=prediction["parameters"]["organic_carbon"],
            trihalomethanes=prediction["parameters"]["trihalomethanes"],
            turbidity=prediction["parameters"]["turbidity"],
            dissolved_oxygen=prediction["parameters"]["dissolved_oxygen"],
            nitrate=prediction["parameters"]["nitrate"],
            lead=prediction["parameters"]["lead"],
            water_safety_score=prediction["water_safety_score"],
            status=prediction["status"],
            risk_level=prediction["risk_level"],
            is_potable=prediction["is_potable"],
            potability_probability=prediction["potability_probability"],
            explanation_json=json.dumps(prediction["xai"]),
            disease_risks_json=json.dumps(prediction["disease_risks"]),
            recommendations_json=json.dumps(prediction["recommendations"])
        )
        db.add(sample)
        created_samples.append(sample)
        
    db.commit()
    
    return {
        "message": f"Successfully processed {len(created_samples)} water samples from CSV.",
        "samples_count": len(created_samples),
        "safe_count": sum(1 for s in created_samples if s.status == "SAFE"),
        "risk_count": sum(1 for s in created_samples if s.status in ["UNSAFE", "CRITICAL"])
    }


@router.get("/history")
def get_history(
    status: Optional[str] = None,
    risk_level: Optional[str] = None,
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(WaterSample)
    if status:
        query = query.filter(WaterSample.status == status.upper())
    if risk_level:
        query = query.filter(WaterSample.risk_level == risk_level.upper())
        
    samples = query.order_by(desc(WaterSample.created_at)).limit(limit).all()
    return [_format_sample_response(s) for s in samples]


@router.get("/{sample_id}")
def get_sample_detail(sample_id: int, db: Session = Depends(get_db)):
    sample = db.query(WaterSample).filter(WaterSample.id == sample_id).first()
    if not sample:
        raise HTTPException(status_code=404, detail="Water sample not found.")
    return _format_sample_response(sample)
