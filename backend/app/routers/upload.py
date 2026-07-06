from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import os
import uuid

router = APIRouter()

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

REQUIRED_COLUMNS = ["timestamp", "building_id", "device_id", "energy_usage"]


@router.post("/")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith((".csv", ".xlsx")):
        raise HTTPException(status_code=400, detail="Only CSV or XLSX files are allowed")

    file_id = str(uuid.uuid4())
    file_extension = file.filename.split(".")[-1]
    saved_filename = f"{file_id}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)
    except Exception:
        raise HTTPException(status_code=400, detail="Unable to read uploaded file")

    df.columns = df.columns.str.lower().str.strip()

    missing_columns = [col for col in REQUIRED_COLUMNS if col not in df.columns]

    if missing_columns:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {missing_columns}"
        )

    try:
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        df["energy_usage"] = pd.to_numeric(df["energy_usage"])
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid timestamp or energy_usage format"
        )

    return {
        "message": "Dataset uploaded successfully",
        "file_id": file_id,
        "filename": file.filename,
        "saved_as": saved_filename,
        "rows": len(df),
        "columns": list(df.columns)
    }