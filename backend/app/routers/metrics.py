from fastapi import APIRouter, HTTPException
import os
import joblib

router = APIRouter()

MODEL_DIR = "app/trained_models"


@router.get("/{file_name}")
def get_model_metrics(file_name: str):
    model_path = os.path.join(MODEL_DIR, f"{file_name}.pkl")

    if not os.path.exists(model_path):
        raise HTTPException(
            status_code=404,
            detail="Model not trained. Please run /train/{file_name} first."
        )

    model_data = joblib.load(model_path)

    return {
        "best_model": model_data.get("best_model_name"),
        "feature_columns": model_data.get("feature_columns"),
        "metrics": model_data.get("metrics"),
        "message": "Model metrics loaded successfully"
    }