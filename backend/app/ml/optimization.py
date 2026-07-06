import pandas as pd


def generate_recommendations(file_path):
    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)

    df.columns = df.columns.str.lower().str.strip()
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["hour"] = df["timestamp"].dt.hour

    avg_usage = df["energy_usage"].mean()
    max_usage = df["energy_usage"].max()

    recommendations = []

    peak_data = df[df["energy_usage"] > avg_usage * 1.25]

    if not peak_data.empty:
        peak_hours = peak_data["hour"].value_counts().head(3).index.tolist()
        recommendations.append({
            "type": "Peak Load Reduction",
            "message": f"High energy usage is common during hours {peak_hours}. Shift heavy tasks to off-peak hours.",
            "priority": "High"
        })

    if "occupancy" in df.columns:
        low_occupancy_high_usage = df[
            (df["occupancy"] < df["occupancy"].mean() * 0.6) &
            (df["energy_usage"] > avg_usage)
        ]

        if not low_occupancy_high_usage.empty:
            recommendations.append({
                "type": "Low Occupancy Optimization",
                "message": "Energy usage is high during low occupancy periods. Reduce HVAC or lighting usage.",
                "priority": "Medium"
            })

    night_usage = df[
        (df["hour"] >= 0) &
        (df["hour"] <= 5) &
        (df["energy_usage"] > avg_usage)
    ]

    if not night_usage.empty:
        recommendations.append({
            "type": "Night-Time Usage",
            "message": "Unexpected night-time energy usage detected. Check unnecessary device operation after working hours.",
            "priority": "High"
        })

    if max_usage > avg_usage * 2:
        recommendations.append({
            "type": "Abnormal Spike",
            "message": "Large energy spike detected. Inspect device behavior and sensor readings.",
            "priority": "High"
        })

    if not recommendations:
        recommendations.append({
            "type": "Normal Usage",
            "message": "Energy usage looks stable. Continue monitoring for future optimization.",
            "priority": "Low"
        })

    estimated_saving_percent = min(len(recommendations) * 5, 25)

    return {
        "average_usage": round(float(avg_usage), 2),
        "maximum_usage": round(float(max_usage), 2),
        "estimated_saving_percent": estimated_saving_percent,
        "recommendations": recommendations
    }