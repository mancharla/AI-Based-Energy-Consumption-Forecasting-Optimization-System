from fastapi import APIRouter, HTTPException, Query
import os

from app.ml.forecasting import generate_forecast
from app.ml.peak_prediction import detect_peak_usage

router = APIRouter()

UPLOAD_DIR = "app/uploads"


@router.get("/{file_name}")
def peak_usage_prediction(
    file_name: str,
    period: str = Query("24h", enum=["24h", "7d", "30d"])
):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset file not found")

    try:
        result = generate_forecast(file_path, file_name, period)
        forecast_data = result["forecast"]
        peaks = detect_peak_usage(forecast_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "message": "Peak usage prediction generated successfully",
        "period": period,
        "peaks": peaks
    }