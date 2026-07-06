from fastapi import APIRouter, HTTPException
import os

from app.ml.training import train_models

router = APIRouter()

UPLOAD_DIR = "app/uploads"


@router.post("/{file_name}")
def train_model(file_name: str):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    try:
        result = train_models(file_path, file_name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return result