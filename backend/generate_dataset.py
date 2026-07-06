import pandas as pd
import numpy as np

np.random.seed(42)

start_date = "2026-01-01"
periods = 90 * 24   # 90 days hourly data

timestamps = pd.date_range(start=start_date, periods=periods, freq="h")

data = []

for ts in timestamps:
    hour = ts.hour
    day_of_week = ts.dayofweek

    # Base usage
    base_usage = 35

    # Office/building active hours
    if 8 <= hour <= 18:
        base_usage += 25

    # Evening peak
    if 18 <= hour <= 21:
        base_usage += 35

    # Weekend lower usage
    if day_of_week in [5, 6]:
        base_usage -= 10

    temperature = np.random.randint(24, 38)
    occupancy = np.random.randint(20, 130)

    # Temperature impact
    temp_effect = (temperature - 25) * 1.2

    # Occupancy impact
    occupancy_effect = occupancy * 0.15

    noise = np.random.normal(0, 5)

    energy_usage = base_usage + temp_effect + occupancy_effect + noise

    data.append({
        "timestamp": ts,
        "building_id": "B1",
        "device_id": "HVAC_1",
        "energy_usage": round(energy_usage, 2),
        "temperature": temperature,
        "occupancy": occupancy
    })

df = pd.DataFrame(data)

# Add few abnormal spikes
spike_indexes = np.random.choice(df.index, size=20, replace=False)
df.loc[spike_indexes, "energy_usage"] += np.random.randint(50, 100, size=20)

df.to_csv("large_energy_dataset.csv", index=False)

print("large_energy_dataset.csv created successfully")
print("Rows:", len(df))