from fastapi import APIRouter, HTTPException
import pandas as pd
import os

router = APIRouter()

UPLOAD_DIR = "app/uploads"


@router.get("/summary/{file_name}")
def dashboard_summary(file_name: str):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    try:
        if file_path.endswith(".csv"):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        df.columns = df.columns.str.lower().str.strip()
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        df["hour"] = df["timestamp"].dt.hour

        total_consumption = df["energy_usage"].sum()
        avg_usage = df["energy_usage"].mean()
        max_usage = df["energy_usage"].max()
        min_usage = df["energy_usage"].min()

        hourly_usage = df.groupby("hour")["energy_usage"].mean()
        peak_hour = int(hourly_usage.idxmax())

        return {
            "total_consumption": round(float(total_consumption), 2),
            "average_usage": round(float(avg_usage), 2),
            "maximum_usage": round(float(max_usage), 2),
            "minimum_usage": round(float(min_usage), 2),
            "total_records": len(df),
            "building_count": int(df["building_id"].nunique()),
            "device_count": int(df["device_id"].nunique()),
            "peak_hour": f"{peak_hour}:00",
            "message": "Dashboard summary generated successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/hourly/{file_name}")
def hourly_usage(file_name: str):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    df = pd.read_csv(file_path) if file_path.endswith(".csv") else pd.read_excel(file_path)
    df.columns = df.columns.str.lower().str.strip()
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["hour"] = df["timestamp"].dt.hour

    chart_data = (
        df.groupby("hour")["energy_usage"]
        .mean()
        .reset_index()
        .to_dict(orient="records")
    )

    return chart_data


@router.get("/daily/{file_name}")
def daily_usage(file_name: str):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    df = pd.read_csv(file_path) if file_path.endswith(".csv") else pd.read_excel(file_path)
    df.columns = df.columns.str.lower().str.strip()
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["date"] = df["timestamp"].dt.date

    chart_data = (
        df.groupby("date")["energy_usage"]
        .sum()
        .reset_index()
    )

    chart_data["date"] = chart_data["date"].astype(str)

    return chart_data.to_dict(orient="records")


@router.get("/device-wise/{file_name}")
def device_wise_usage(file_name: str):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    df = pd.read_csv(file_path) if file_path.endswith(".csv") else pd.read_excel(file_path)
    df.columns = df.columns.str.lower().str.strip()

    chart_data = (
        df.groupby("device_id")["energy_usage"]
        .sum()
        .reset_index()
        .to_dict(orient="records")
    )

    return chart_data


@router.get("/building-wise/{file_name}")
def building_wise_usage(file_name: str):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    df = pd.read_csv(file_path) if file_path.endswith(".csv") else pd.read_excel(file_path)
    df.columns = df.columns.str.lower().str.strip()

    chart_data = (
        df.groupby("building_id")["energy_usage"]
        .sum()
        .reset_index()
        .to_dict(orient="records")
    )

    return chart_data