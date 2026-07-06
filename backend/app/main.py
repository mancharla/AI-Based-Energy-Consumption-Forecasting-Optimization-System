from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import upload, forecast, anomalies, recommendations, simulation, dashboard, peaks, train, metrics, reports
from app.database import Base, engine
from app.routers import auth


# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-Based Energy Consumption Forecasting API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(forecast.router, prefix="/forecast", tags=["Forecast"])
app.include_router(anomalies.router, prefix="/anomalies", tags=["Anomalies"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
app.include_router(simulation.router, prefix="/simulation", tags=["Simulation"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(peaks.router, prefix="/peaks", tags=["Peaks"])
app.include_router(train.router, prefix="/train", tags=["Training"])
app.include_router(metrics.router, prefix="/metrics", tags=["Metrics"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
@app.get("/")
def root():
    return {"message": "Energy Forecasting API is running"}