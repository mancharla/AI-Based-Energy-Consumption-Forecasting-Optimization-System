import os
import joblib
import pandas as pd

MODEL_DIR = "app/trained_models"


def create_time_features(df):
    df = df.copy()
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    df["hour"] = df["timestamp"].dt.hour
    df["day"] = df["timestamp"].dt.day
    df["month"] = df["timestamp"].dt.month
    df["day_of_week"] = df["timestamp"].dt.dayofweek

    return df


def generate_forecast(file_path, file_name, period="24h"):
    model_path = os.path.join(MODEL_DIR, f"{file_name}.pkl")

    if not os.path.exists(model_path):
        raise Exception("Model not trained. Please run /train/{file_name} first.")

    model_data = joblib.load(model_path)

    model = model_data["model"]
    feature_columns = model_data["feature_columns"]

    df = pd.read_csv(file_path) if file_path.endswith(".csv") else pd.read_excel(file_path)

    df.columns = df.columns.str.lower().str.strip()
    df["timestamp"] = pd.to_datetime(df["timestamp"])

    last_timestamp = df["timestamp"].max()

    if period == "24h":
        steps = 24
        freq = "h"
    elif period == "7d":
        steps = 7
        freq = "D"
    elif period == "30d":
        steps = 30
        freq = "D"
    else:
        raise ValueError("Invalid period. Use 24h, 7d, or 30d")

    future_dates = pd.date_range(
        start=last_timestamp + pd.Timedelta(hours=1),
        periods=steps,
        freq=freq
    )

    future_df = pd.DataFrame({"timestamp": future_dates})
    future_df = create_time_features(future_df)

    if "temperature" in feature_columns:
        future_df["temperature"] = df["temperature"].mean()

    if "occupancy" in feature_columns:
        future_df["occupancy"] = df["occupancy"].mean()

    predictions = model.predict(future_df[feature_columns])

    forecast = []

    for timestamp, prediction in zip(future_dates, predictions):
        forecast.append({
            "timestamp": str(timestamp),
            "predicted_energy_usage": round(float(prediction), 2)
        })

    historical = df.tail(48)[["timestamp", "energy_usage"]].copy()
    historical["timestamp"] = historical["timestamp"].astype(str)

    return {
        "historical": historical.to_dict(orient="records"),
        "forecast": forecast
    }