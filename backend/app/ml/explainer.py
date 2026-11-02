import numpy as np
from typing import Dict, List, Any
from app.ml.dataset import PARAMETER_CONFIG, FEATURE_COLUMNS


def calculate_explainable_ai(parameters: Dict[str, float], feature_importances: Dict[str, float]) -> Dict[str, Any]:
    """
    Computes feature contribution scores and deviation rankings relative to WHO/EPA standards.
    Returns ranked contributors, impact level, and human-readable explanation sentences.
    """
    contributions = []
    total_anomaly_score = 0.0
    
    for feat in FEATURE_COLUMNS:
        val = float(parameters.get(feat, 0.0))
        cfg = PARAMETER_CONFIG[feat]
        
        safe_min = cfg["safe_min"]
        safe_max = cfg["safe_max"]
        model_weight = feature_importances.get(feat, 1.0 / len(FEATURE_COLUMNS))
        
        # Calculate deviation from safe range
        if val < safe_min:
            deviation = (safe_min - val) / (safe_min if safe_min > 0 else 1.0)
            status = "BELOW_SAFE"
        elif val > safe_max:
            deviation = (val - safe_max) / (safe_max if safe_max > 0 else 1.0)
            status = "ABOVE_SAFE"
        else:
            deviation = 0.0
            status = "SAFE"
            
        # Contribution score combines parameter deviation severity and ML model importance weight
        contribution_score = float(deviation * (1.0 + model_weight * 5.0))
        total_anomaly_score += contribution_score
        
        if contribution_score > 1.5:
            impact_level = "High Contribution"
        elif contribution_score > 0.4:
            impact_level = "Moderate Contribution"
        elif contribution_score > 0.0:
            impact_level = "Low Contribution"
        else:
            impact_level = "Normal / Safe"
            
        contributions.append({
            "feature": feat,
            "name": cfg["name"],
            "unit": cfg["unit"],
            "value": round(val, 4),
            "safe_range": f"{safe_min} - {safe_max} {cfg['unit']}",
            "status": status,
            "deviation": round(deviation, 4),
            "model_weight": round(model_weight, 4),
            "contribution_score": round(contribution_score, 4),
            "impact_level": impact_level
        })
        
    # Sort by contribution score descending
    contributions.sort(key=lambda x: x["contribution_score"], reverse=True)
    
    # Generate human-understandable XAI natural language summary
    high_risk_params = [c for c in contributions if c["impact_level"] in ["High Contribution", "Moderate Contribution"]]
    
    if not high_risk_params:
        explanation_summary = "All analyzed parameters reside within WHO/EPA recommended safety thresholds. No significant risk contributors identified."
    else:
        top_drivers = ", ".join([f"{c['name']} ({c['value']} {c['unit']})" for c in high_risk_params[:3]])
        explanation_summary = f"The primary parameters driving the elevated risk classification are {top_drivers}."
        
    return {
        "ranked_contributions": contributions,
        "top_contributors": high_risk_params[:4],
        "explanation_summary": explanation_summary,
        "total_anomaly_score": round(total_anomaly_score, 4)
    }
