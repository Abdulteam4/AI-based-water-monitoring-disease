import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.ml.trainer import train_and_evaluate_models

if __name__ == "__main__":
    print("Starting ML Model training and evaluation...")
    summary = train_and_evaluate_models(dataset_samples=3500)
    print("Model Training Summary:")
    print(f"Best Algorithm: {summary['best_model']}")
    print(f"Accuracy: {summary['best_model_performance']['accuracy'] * 100:.2f}%")
    print(f"F1-Score: {summary['best_model_performance']['f1_score']:.4f}")
    print(f"ROC-AUC: {summary['best_model_performance']['roc_auc']:.4f}")
