def detect_peak_usage(forecast_data):
    values = [item["predicted_energy_usage"] for item in forecast_data]

    if not values:
        return {
            "peak_periods": [],
            "alerts": []
        }

    average_usage = sum(values) / len(values)
    threshold = average_usage * 1.20

    peak_periods = []
    alerts = []

    for item in forecast_data:
        usage = item["predicted_energy_usage"]

        if usage >= threshold:
            peak_periods.append({
                "timestamp": item["timestamp"],
                "predicted_energy_usage": usage,
                "threshold": round(threshold, 2)
            })

            alerts.append(
                f"Expected peak consumption at {item['timestamp']} with {usage} kWh"
            )

    return {
        "average_usage": round(average_usage, 2),
        "threshold": round(threshold, 2),
        "peak_periods": peak_periods,
        "alerts": alerts
    }