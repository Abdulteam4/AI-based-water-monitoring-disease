import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix
)

from app.ml.dataset import generate_water_dataset, FEATURE_COLUMNS, PARAMETER_CONFIG

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "ml_models")
MODEL_PATH = os.path.join(MODEL_DIR, "best_water_model.joblib")
METRICS_PATH = os.path.join(MODEL_DIR, "metrics.json")


def train_and_evaluate_models(dataset_samples: int = 3500) -> Dict[str, Any]:
    """
    Trains multiple ML algorithms on water potability dataset, compares evaluation metrics,
    and serializes the top-performing model artifact along with detailed metrics.
    """
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # 1. Generate / Load dataset
    df = generate_water_dataset(n_samples=dataset_samples, random_state=42)
    
    X = df[FEATURE_COLUMNS]
    y = df["is_potable"]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    candidate_models = {
        "RandomForest": RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42),
        "GradientBoosting": GradientBoostingClassifier(n_estimators=120, learning_rate=0.08, max_depth=5, random_state=42),
        "DecisionTree": DecisionTreeClassifier(max_depth=8, random_state=42),
        "LogisticRegression": LogisticRegression(max_iter=1000, random_state=42),
        "SVM": SVC(probability=True, kernel="rbf", random_state=42),
        "KNN": KNeighborsClassifier(n_neighbors=7)
    }
    
    results = {}
    best_name = None
    best_f1 = -1.0
    best_pipeline = None
    
    for name, clf in candidate_models.items():
        pipeline = Pipeline([
            ("scaler", StandardScaler()),
            ("classifier", clf)
        ])
        
        pipeline.fit(X_train, y_train)
        
        y_pred = pipeline.predict(X_test)
        y_proba = pipeline.predict_proba(X_test)[:, 1] if hasattr(pipeline, "predict_proba") else y_pred
        
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        auc = float(roc_auc_score(y_test, y_proba))
        cm = confusion_matrix(y_test, y_pred).tolist()
        
        results[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(auc, 4),
            "confusion_matrix": cm
        }
        
        # Select best model based on F1 Score
        if f1 > best_f1:
            best_f1 = f1
            best_name = name
            best_pipeline = pipeline
            
    # Extract feature importances if available
    classifier_obj = best_pipeline.named_steps["classifier"]
    feature_importances = {}
    
    if hasattr(classifier_obj, "feature_importances_"):
        importances = classifier_obj.feature_importances_
        for feat, imp in zip(FEATURE_COLUMNS, importances):
            feature_importances[feat] = round(float(imp), 4)
    elif hasattr(classifier_obj, "coef_"):
        coefs = np.abs(classifier_obj.coef_[0])
        norm_coefs = coefs / np.sum(coefs)
        for feat, imp in zip(FEATURE_COLUMNS, norm_coefs):
            feature_importances[feat] = round(float(imp), 4)
    else:
        # Equal importance default for KNN/SVM if not available
        for feat in FEATURE_COLUMNS:
            feature_importances[feat] = round(1.0 / len(FEATURE_COLUMNS), 4)
            
    # Sort feature importances descending
    sorted_importances = dict(sorted(feature_importances.items(), key=lambda item: item[1], reverse=True))
    
    # Save best model pipeline
    joblib.dump(best_pipeline, MODEL_PATH)
    
    summary = {
        "best_model": best_name,
        "metrics": results,
        "best_model_performance": results[best_name],
        "feature_importances": sorted_importances,
        "dataset_info": {
            "total_samples": len(df),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "features_count": len(FEATURE_COLUMNS),
            "features_list": FEATURE_COLUMNS
        }
    }
    
    with open(METRICS_PATH, "w") as f:
        json.dump(summary, f, indent=2)
        
    print(f"Successfully trained models! Best model: '{best_name}' (F1: {best_f1:.4f}). Saved to {MODEL_PATH}")
    return summary


if __name__ == "__main__":
    train_and_evaluate_models()