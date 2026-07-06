import os
import joblib
import pandas as pd
import numpy as np

from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split


MODEL_DIR = "app/trained_models"
os.makedirs(MODEL_DIR, exist_ok=True)


def prepare_features(df):
    df = df.copy()
    df.columns = df.columns.str.lower().str.strip()

    df["timestamp"] = pd.to_datetime(df["timestamp"])

    df["hour"] = df["timestamp"].dt.hour
    df["day"] = df["timestamp"].dt.day
    df["month"] = df["timestamp"].dt.month
    df["day_of_week"] = df["timestamp"].dt.dayofweek

    feature_columns = ["hour", "day", "month", "day_of_week"]

    if "temperature" in df.columns:
        feature_columns.append("temperature")

    if "occupancy" in df.columns:
        feature_columns.append("occupancy")

    X = df[feature_columns]
    y = df["energy_usage"]

    return X, y, feature_columns


def calculate_metrics(y_test, y_pred):
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100
    r2 = r2_score(y_test, y_pred)

    return {
        "mae": round(float(mae), 2),
        "rmse": round(float(rmse), 2),
        "mape": round(float(mape), 2),
        "r2_score": round(float(r2), 2)
    }


def train_models(file_path, file_name):
    df = pd.read_csv(file_path) if file_path.endswith(".csv") else pd.read_excel(file_path)

    X, y, feature_columns = prepare_features(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )

    models = {
        "linear_regression": LinearRegression(),
        "random_forest": RandomForestRegressor(
            n_estimators=150,
            random_state=42
        )
    }

    results = {}
    best_model_name = None
    best_rmse = float("inf")
    best_model = None

    for name, model in models.items():
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)

        metrics = calculate_metrics(y_test, predictions)

        results[name] = metrics

        if metrics["rmse"] < best_rmse:
            best_rmse = metrics["rmse"]
            best_model_name = name
            best_model = model

    model_data = {
        "model": best_model,
        "feature_columns": feature_columns,
        "best_model_name": best_model_name,
        "metrics": results
    }

    model_path = os.path.join(MODEL_DIR, f"{file_name}.pkl")
    joblib.dump(model_data, model_path)

    return {
        "message": "Model training completed successfully",
        "best_model": best_model_name,
        "model_path": model_path,
        "metrics": results,
        "feature_columns": feature_columns
    }