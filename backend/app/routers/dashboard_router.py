from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from app.database import get_db
from app.models import WaterSample, Alert, Location
from app.ml.predictor import get_model_and_metrics

router = APIRouter(prefix="/dashboard", tags=["Dashboard Overview"])

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    _, metrics = get_model_and_metrics()
    
    total_samples = db.query(func.count(WaterSample.id)).scalar() or 0
    safe_samples = db.query(func.count(WaterSample.id)).filter(WaterSample.status == "SAFE").scalar() or 0
    moderate_samples = db.query(func.count(WaterSample.id)).filter(WaterSample.status == "MODERATE").scalar() or 0
    unsafe_samples = db.query(func.count(WaterSample.id)).filter(WaterSample.status.in_(["UNSAFE", "CRITICAL"])).scalar() or 0
    
    unresolved_alerts = db.query(func.count(Alert.id)).filter(Alert.is_resolved == False).scalar() or 0
    locations_count = db.query(func.count(Location.id)).scalar() or 0
    
    # Recent samples (last 8)
    recent_samples_db = db.query(WaterSample).order_by(desc(WaterSample.created_at)).limit(8).all()
    recent_samples = [
        {
            "id": s.id,
            "sample_code": s.sample_code,
            "location_name": s.location.name if s.location else "Main Water Supply",
            "score": s.water_safety_score,
            "status": s.status,
            "risk_level": s.risk_level,
            "turbidity": s.turbidity,
            "ph": s.ph,
            "created_at": s.created_at
        } for s in recent_samples_db
    ]
    
    # Status distribution for Donut Chart
    status_distribution = [
        {"name": "Safe Water", "value": safe_samples, "color": "#10B981"},
        {"name": "Moderate Warning", "value": moderate_samples, "color": "#F59E0B"},
        {"name": "High / Critical Risk", "value": unsafe_samples, "color": "#EF4444"}
    ]
    
    # Risk trend timelines
    trend_db = db.query(WaterSample).order_by(desc(WaterSample.created_at)).limit(20).all()
    trend_db.reverse()
    timeline = [
        {
            "id": s.id,
            "code": s.sample_code,
            "score": s.water_safety_score,
            "turbidity": s.turbidity,
            "ph": s.ph,
            "tds": s.solids,
            "created_at": s.created_at.strftime("%b %d, %H:%M")
        } for s in trend_db
    ]
    
    best_acc = metrics.get("best_model_performance", {}).get("accuracy", 0.94) * 100
    
    return {
        "kpis": {
            "total_samples": total_samples,
            "safe_samples": safe_samples,
            "risk_samples": unsafe_samples,
            "unresolved_alerts": unresolved_alerts,
            "locations_count": locations_count,
            "model_accuracy": round(best_acc, 1),
            "disease_risk_index": "MODERATE" if unsafe_samples > 0 else "LOW"
        },
        "recent_samples": recent_samples,
        "status_distribution": status_distribution,
        "timeline": timeline,
        "model_name": metrics.get("best_model", "RandomForest")
    }
