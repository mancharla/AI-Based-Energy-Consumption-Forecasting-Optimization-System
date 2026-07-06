from fastapi import APIRouter
from fastapi import HTTPException
import os

from app.ml.anomaly_detection import detect_anomalies

router = APIRouter()

UPLOAD_DIR = "app/uploads"


@router.get("/{file_name}")
def anomaly_detection(file_name: str):

    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    return detect_anomalies(file_path)