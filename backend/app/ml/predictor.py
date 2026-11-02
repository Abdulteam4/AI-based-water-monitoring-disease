import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Any

from app.ml.dataset import FEATURE_COLUMNS, PARAMETER_CONFIG
from app.ml.trainer import MODEL_PATH, METRICS_PATH, train_and_evaluate_models
from app.ml.explainer import calculate_explainable_ai
from app.ml.disease_engine import evaluate_disease_risks
from app.ml.recommendation_engine import generate_recommendations

_MODEL_CACHE = None
_METRICS_CACHE = None


def get_model_and_metrics():
    """
    Retrieves or loads the trained model pipeline and metrics JSON metadata.
    Automatically triggers model training if model file does not exist.
    """
    global _MODEL_CACHE, _METRICS_CACHE
    
    if _MODEL_CACHE is None or _METRICS_CACHE is None:
        if not os.path.exists(MODEL_PATH) or not os.path.exists(METRICS_PATH):
            print("Model artifact not found. Training model pipeline...")
            train_and_evaluate_models()
            
        _MODEL_CACHE = joblib.load(MODEL_PATH)
        with open(METRICS_PATH, "r") as f:
            _METRICS_CACHE = json.load(f)
            
    return _MODEL_CACHE, _METRICS_CACHE


def predict_water_quality(parameters: Dict[str, float]) -> Dict[str, Any]:
    """
    Main prediction pipeline: validates parameters, performs ML inference,
    calculates Water Safety Score (0-100), generates XAI feature breakdown,
    evaluates disease risks, and produces treatment recommendations.
    """
    pipeline, metrics = get_model_and_metrics()
    feature_importances = metrics.get("feature_importances", {})
    
    # Fill missing parameters with WHO standard midpoints if any missing
    processed_params = {}
    for feat in FEATURE_COLUMNS:
        if feat in parameters and parameters[feat] is not None:
            processed_params[feat] = float(parameters[feat])
        else:
            cfg = PARAMETER_CONFIG[feat]
            processed_params[feat] = float((cfg["safe_min"] + cfg["safe_max"]) / 2.0)
            
    # Prepare input DataFrame for pipeline
    df_input = pd.DataFrame([processed_params])[FEATURE_COLUMNS]
    
    # ML model inference
    is_potable_pred = int(pipeline.predict(df_input)[0])
    
    if hasattr(pipeline, "predict_proba"):
        potability_probability = float(pipeline.predict_proba(df_input)[0][1])
    else:
        potability_probability = 1.0 if is_potable_pred == 1 else 0.0
        
    # Explainable AI calculation
    xai_results = calculate_explainable_ai(processed_params, feature_importances)
    anomaly_penalty = min(xai_results["total_anomaly_score"] * 12.0, 60.0)
    
    # Calculate Water Safety Score (0-100)
    raw_score = (potability_probability * 100.0 * 0.6) + ((100.0 - anomaly_penalty) * 0.4)
    water_safety_score = max(0, min(100, int(round(raw_score))))
    
    # Categorize Status & Risk Level based on Score
    if water_safety_score >= 80:
        status = "SAFE"
        risk_level = "LOW"
    elif water_safety_score >= 65:
        status = "MODERATE"
        risk_level = "MODERATE"
    elif water_safety_score >= 40:
        status = "UNSAFE"
        risk_level = "HIGH"
    else:
        status = "CRITICAL"
        risk_level = "CRITICAL"
        
    # Evaluate Disease Risks
    disease_risk_results = evaluate_disease_risks(processed_params)
    
    # Generate Recommendations
    recommendations = generate_recommendations(processed_params, status)
    
    return {
        "is_potable": is_potable_pred == 1,
        "potability_probability": round(potability_probability, 4),
        "water_safety_score": water_safety_score,
        "status": status,
        "risk_level": risk_level,
        "parameters": processed_params,
        "xai": xai_results,
        "disease_risks": disease_risk_results,
        "recommendations": recommendations,
        "model_version": metrics.get("best_model", "WaterSafetyModel_v1"),
        "model_accuracy": metrics.get("best_model_performance", {}).get("accuracy", 0.92)
    }
