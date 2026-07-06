import pandas as pd
from sklearn.ensemble import IsolationForest


def detect_anomalies(file_path):

    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)

    df.columns = df.columns.str.lower().str.strip()

    df["timestamp"] = pd.to_datetime(df["timestamp"])

    model = IsolationForest(
        contamination=0.02,
        random_state=42
    )

    df["anomaly"] = model.fit_predict(df[["energy_usage"]])

    anomalies = df[df["anomaly"] == -1]

    results = []

    for _, row in anomalies.iterrows():

        results.append({
            "timestamp": str(row["timestamp"]),
            "building_id": row["building_id"],
            "device_id": row["device_id"],
            "energy_usage": float(row["energy_usage"])
        })

    return {
        "total_records": len(df),
        "anomaly_count": len(anomalies),
        "anomalies": results
    }