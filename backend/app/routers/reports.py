from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from app.ml.forecasting import generate_forecast
from app.ml.optimization import generate_recommendations
from app.ml.anomaly_detection import detect_anomalies

router = APIRouter()

UPLOAD_DIR = "app/uploads"
REPORT_DIR = "app/reports"

os.makedirs(REPORT_DIR, exist_ok=True)


@router.get("/forecast-csv/{file_name}")
def export_forecast_csv(file_name: str, period: str = "24h"):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    result = generate_forecast(file_path, file_name, period)
    forecast_df = pd.DataFrame(result["forecast"])

    report_path = os.path.join(REPORT_DIR, f"forecast_{file_name}.csv")
    forecast_df.to_csv(report_path, index=False)

    return FileResponse(
        report_path,
        media_type="text/csv",
        filename=f"forecast_{file_name}.csv"
    )


@router.get("/analytics-pdf/{file_name}")
def export_analytics_pdf(file_name: str):
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    df = pd.read_csv(file_path) if file_path.endswith(".csv") else pd.read_excel(file_path)
    df.columns = df.columns.str.lower().str.strip()

    recommendations = generate_recommendations(file_path)
    anomalies = detect_anomalies(file_path)

    pdf_path = os.path.join(REPORT_DIR, f"analytics_{file_name}.pdf")

    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter

    y = height - 50

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "Energy Consumption Analytics Report")

    y -= 40
    c.setFont("Helvetica", 11)

    c.drawString(50, y, f"Dataset: {file_name}")
    y -= 20
    c.drawString(50, y, f"Total Records: {len(df)}")
    y -= 20
    c.drawString(50, y, f"Total Consumption: {round(float(df['energy_usage'].sum()), 2)} kWh")
    y -= 20
    c.drawString(50, y, f"Average Usage: {round(float(df['energy_usage'].mean()), 2)} kWh")
    y -= 20
    c.drawString(50, y, f"Maximum Usage: {round(float(df['energy_usage'].max()), 2)} kWh")
    y -= 20
    c.drawString(50, y, f"Minimum Usage: {round(float(df['energy_usage'].min()), 2)} kWh")

    y -= 40
    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, y, "Anomaly Summary")

    y -= 25
    c.setFont("Helvetica", 11)
    c.drawString(50, y, f"Anomaly Count: {anomalies['anomaly_count']}")

    y -= 40
    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, y, "Optimization Recommendations")

    y -= 25
    c.setFont("Helvetica", 10)

    for rec in recommendations["recommendations"]:
        if y < 80:
            c.showPage()
            y = height - 50
            c.setFont("Helvetica", 10)

        text = f"{rec['priority']} - {rec['type']}: {rec['message']}"
        c.drawString(50, y, text[:95])
        y -= 20

    c.save()

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"analytics_{file_name}.pdf"
    )