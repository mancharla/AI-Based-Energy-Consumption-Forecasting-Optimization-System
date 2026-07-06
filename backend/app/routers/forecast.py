from fastapi import APIRouter, HTTPException, Query
import os

from app.ml.forecasting import generate_forecast

router = APIRouter()

UPLOAD_DIR = "app/uploads"


@router.get("/{file_name}")
def forecast_energy(
    file_name: str,
    period: str = Query("24h", enum=["24h", "7d", "30d"])
):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset file not found")

    try:
        result = generate_forecast(file_path, file_name, period)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "message": "Forecast generated successfully",
        "period": period,
        "data": result
    }