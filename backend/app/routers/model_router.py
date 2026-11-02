from fastapi import APIRouter
from app.ml.predictor import get_model_and_metrics
from app.ml.dataset import PARAMETER_CONFIG

router = APIRouter(prefix="/model", tags=["ML Model Metadata & XAI"])

@router.get("/info")
def get_model_info():
    _, metrics = get_model_and_metrics()
    
    # Format parameter configurations for frontend
    param_configs = []
    for key, cfg in PARAMETER_CONFIG.items():
        param_configs.append({
            "key": key,
            "name": cfg["name"],
            "unit": cfg["unit"],
            "safe_range": f"{cfg['safe_min']} – {cfg['safe_max']} {cfg['unit']}",
            "safe_min": cfg["safe_min"],
            "safe_max": cfg["safe_max"],
            "description": cfg["description"]
        })
        
    return {
        "model_name": metrics.get("best_model", "RandomForestClassifier"),
        "best_model_performance": metrics.get("best_model_performance", {}),
        "all_models_metrics": metrics.get("metrics", {}),
        "feature_importances": metrics.get("feature_importances", {}),
        "dataset_info": metrics.get("dataset_info", {}),
        "parameter_configurations": param_configs,
        "disclaimer": "Model performance is evaluated on WHO/EPA compliant validation datasets. Real-world water parameters should be periodically re-verified against certified laboratory standard procedures."
    }
