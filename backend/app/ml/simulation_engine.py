import pandas as pd


def simulate_scenario(
    file_path,
    occupancy_change=0,
    temperature_change=0,
    device_shutdown=False,
    peak_reduction_percent=0
):
    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)

    df.columns = df.columns.str.lower().str.strip()
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["hour"] = df["timestamp"].dt.hour

    original_consumption = df["energy_usage"].sum()
    simulated_usage = df["energy_usage"].copy()

    if "occupancy" in df.columns and occupancy_change != 0:
        simulated_usage += simulated_usage * (occupancy_change / 100) * 0.4

    if "temperature" in df.columns and temperature_change != 0:
        simulated_usage += temperature_change * 1.5

    if device_shutdown:
        simulated_usage *= 0.85

    if peak_reduction_percent > 0:
        peak_hours = df["hour"].between(18, 21)
        simulated_usage.loc[peak_hours] *= (1 - peak_reduction_percent / 100)

    simulated_consumption = simulated_usage.sum()

    savings = original_consumption - simulated_consumption
    savings_percent = (savings / original_consumption) * 100

    return {
        "original_consumption": round(float(original_consumption), 2),
        "simulated_consumption": round(float(simulated_consumption), 2),
        "energy_savings": round(float(savings), 2),
        "savings_percent": round(float(savings_percent), 2),
        "scenario_summary": {
            "occupancy_change_percent": occupancy_change,
            "temperature_change": temperature_change,
            "device_shutdown": device_shutdown,
            "peak_reduction_percent": peak_reduction_percent
        }
    }