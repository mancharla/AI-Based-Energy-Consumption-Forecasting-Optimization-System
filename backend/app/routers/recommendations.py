from fastapi import APIRouter, HTTPException
import os

from app.ml.optimization import generate_recommendations

router = APIRouter()

UPLOAD_DIR = "app/uploads"


@router.get("/{file_name}")
def optimization_recommendations(file_name: str):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    try:
        result = generate_recommendations(file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return result