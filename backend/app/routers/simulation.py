from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

from app.ml.simulation_engine import simulate_scenario

router = APIRouter()

UPLOAD_DIR = "app/uploads"


class SimulationRequest(BaseModel):
    occupancy_change: float = 0
    temperature_change: float = 0
    device_shutdown: bool = False
    peak_reduction_percent: float = 0


@router.post("/{file_name}")
def run_simulation(file_name: str, request: SimulationRequest):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    try:
        result = simulate_scenario(
            file_path=file_path,
            occupancy_change=request.occupancy_change,
            temperature_change=request.temperature_change,
            device_shutdown=request.device_shutdown,
            peak_reduction_percent=request.peak_reduction_percent
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return result