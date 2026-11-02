import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_model_info_endpoint():
    response = client.get("/api/model/info")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "best_model_performance" in data
    assert "feature_importances" in data

def test_water_analysis_safe_sample():
    payload = {
        "location_name": "Test Safe Well",
        "ph": 7.2,
        "hardness": 130.0,
        "solids": 280.0,
        "chloramines": 2.2,
        "sulfate": 140.0,
        "conductivity": 420.0,
        "organic_carbon": 2.8,
        "trihalomethanes": 42.0,
        "turbidity": 1.5,
        "dissolved_oxygen": 8.5,
        "nitrate": 3.5,
        "lead": 0.002
    }
    response = client.post("/api/water/analyze", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "SAFE"
    assert data["water_safety_score"] >= 75
    assert "explanation" in data
    assert "disease_risks" in data

def test_water_analysis_critical_sample():
    payload = {
        "location_name": "Test Contaminated Well",
        "ph": 4.5,
        "hardness": 350.0,
        "solids": 1450.0,
        "chloramines": 0.1,
        "sulfate": 580.0,
        "conductivity": 1200.0,
        "organic_carbon": 14.0,
        "trihalomethanes": 120.0,
        "turbidity": 15.0,
        "dissolved_oxygen": 2.5,
        "nitrate": 28.0,
        "lead": 0.045
    }
    response = client.post("/api/water/analyze", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] in ["UNSAFE", "CRITICAL"]
    assert data["water_safety_score"] < 60
    assert len(data["disease_risks"]["detected_risks"]) > 0

def test_dashboard_summary():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert "recent_samples" in data
