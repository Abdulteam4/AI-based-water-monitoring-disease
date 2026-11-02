import os
import json
import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, Location, WaterSample, Alert
from app.auth import get_password_hash
from app.ml.predictor import get_model_and_metrics, predict_water_quality

from app.routers import (
    auth_router,
    water_router,
    dashboard_router,
    locations_router,
    alerts_router,
    reports_router,
    model_router
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent AI-based water quality analysis and disease risk monitoring web application."
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router, prefix=settings.API_V1_STR)
app.include_router(water_router.router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router.router, prefix=settings.API_V1_STR)
app.include_router(locations_router.router, prefix=settings.API_V1_STR)
app.include_router(alerts_router.router, prefix=settings.API_V1_STR)
app.include_router(reports_router.router, prefix=settings.API_V1_STR)
app.include_router(model_router.router, prefix=settings.API_V1_STR)


@app.on_event("startup")
def startup_populate_demo_data():
    """Ensure ML model is loaded and seed rich realistic demo data if DB is new."""
    print("Pre-loading ML model...")
    get_model_and_metrics()
    
    db: Session = SessionLocal()
    try:
        user_count = db.query(User).count()
        if user_count == 0:
            print("Seeding initial demo data...")
            # Demo User
            demo_user = User(
                email="admin@watermonitor.ai",
                full_name="Dr. Sarah Jenkins (Environmental Health Specialist)",
                hashed_password=get_password_hash("password123"),
                role="Lead Environmental Scientist"
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            
            # Demo Locations
            locations_data = [
                {"name": "Central City Water Treatment Plant", "type": "Municipal Treatment Plant", "address": "104 Riverfront Blvd, Zone 3", "lat": 37.7749, "lng": -122.4194},
                {"name": "Eastside Community Well", "type": "Borewell / Groundwater", "address": "45 Oakwood Lane, District 7", "lat": 37.7833, "lng": -122.4167},
                {"name": "Lake Serene Reservoir", "type": "Surface Water Body", "address": "Reservoir Road North", "lat": 37.7600, "lng": -122.4350},
                {"name": "Home Filtration System - Site B", "type": "Domestic Purifier / RO", "address": "782 Elm Street", "lat": 37.7500, "lng": -122.4200}
            ]
            
            saved_locations = []
            for loc in locations_data:
                l_obj = Location(
                    name=loc["name"],
                    type=loc["type"],
                    address=loc["address"],
                    latitude=loc["lat"],
                    longitude=loc["lng"],
                    user_id=demo_user.id
                )
                db.add(l_obj)
                saved_locations.append(l_obj)
            db.commit()
            
            # Demo Water Samples (Safe, Warning, Critical)
            sample_inputs = [
                {
                    "loc": saved_locations[0],
                    "code": "WS-DEMO-SAFE01",
                    "params": {"ph": 7.3, "hardness": 125, "solids": 240, "chloramines": 2.4, "sulfate": 130, "conductivity": 380, "organic_carbon": 2.2, "trihalomethanes": 35, "turbidity": 1.2, "dissolved_oxygen": 8.8, "nitrate": 2.8, "lead": 0.002}
                },
                {
                    "loc": saved_locations[1],
                    "code": "WS-DEMO-WARN01",
                    "params": {"ph": 6.2, "hardness": 210, "solids": 680, "chloramines": 0.4, "sulfate": 320, "conductivity": 750, "organic_carbon": 6.8, "trihalomethanes": 72, "turbidity": 6.4, "dissolved_oxygen": 5.1, "nitrate": 8.5, "lead": 0.012}
                },
                {
                    "loc": saved_locations[2],
                    "code": "WS-DEMO-CRIT01",
                    "params": {"ph": 4.6, "hardness": 340, "solids": 1450, "chloramines": 0.1, "sulfate": 580, "conductivity": 1280, "organic_carbon": 14.2, "trihalomethanes": 128, "turbidity": 14.8, "dissolved_oxygen": 2.8, "nitrate": 28.4, "lead": 0.048}
                },
                {
                    "loc": saved_locations[3],
                    "code": "WS-DEMO-SAFE02",
                    "params": {"ph": 7.1, "hardness": 85, "solids": 180, "chloramines": 1.8, "sulfate": 95, "conductivity": 310, "organic_carbon": 1.5, "trihalomethanes": 22, "turbidity": 0.8, "dissolved_oxygen": 9.1, "nitrate": 1.9, "lead": 0.001}
                }
            ]
            
            for s in sample_inputs:
                pred = predict_water_quality(s["params"])
                s_obj = WaterSample(
                    sample_code=s["code"],
                    location_id=s["loc"].id,
                    user_id=demo_user.id,
                    ph=pred["parameters"]["ph"],
                    hardness=pred["parameters"]["hardness"],
                    solids=pred["parameters"]["solids"],
                    chloramines=pred["parameters"]["chloramines"],
                    sulfate=pred["parameters"]["sulfate"],
                    conductivity=pred["parameters"]["conductivity"],
                    organic_carbon=pred["parameters"]["organic_carbon"],
                    trihalomethanes=pred["parameters"]["trihalomethanes"],
                    turbidity=pred["parameters"]["turbidity"],
                    dissolved_oxygen=pred["parameters"]["dissolved_oxygen"],
                    nitrate=pred["parameters"]["nitrate"],
                    lead=pred["parameters"]["lead"],
                    water_safety_score=pred["water_safety_score"],
                    status=pred["status"],
                    risk_level=pred["risk_level"],
                    is_potable=pred["is_potable"],
                    potability_probability=pred["potability_probability"],
                    explanation_json=json.dumps(pred["xai"]),
                    disease_risks_json=json.dumps(pred["disease_risks"]),
                    recommendations_json=json.dumps(pred["recommendations"]),
                    is_demo=True
                )
                db.add(s_obj)
                db.commit()
                db.refresh(s_obj)
                
                if pred["risk_level"] in ["HIGH", "CRITICAL"]:
                    top_drv = pred["xai"]["top_contributors"][0]["name"] if pred["xai"]["top_contributors"] else "Contamination Anomaly"
                    alt = Alert(
                        sample_id=s_obj.id,
                        location_name=s["loc"].name,
                        alert_type="Critical Water Contamination Alert",
                        title=f"Critical Contamination Warning - {s['loc'].name}",
                        message=f"Water Sample {s['code']} recorded a Safety Score of {pred['water_safety_score']}/100 ({pred['status']}). Primary cause: {top_drv}.",
                        severity=pred["risk_level"]
                    )
                    db.add(alt)
                    db.commit()
            print("Demo data successfully seeded!")
    finally:
        db.close()


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }


@app.get("/")
def root():
    return {"message": "Welcome to AI Based Water Disease Monitor API. Access /docs for interactive Swagger UI."}
