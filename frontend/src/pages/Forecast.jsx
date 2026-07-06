import { useState } from "react";
import API from "../api/api";
import ForecastChart from "../components/ForecastChart";
import PageHeader from "../components/PageHeader";

function Forecast() {
  const [period, setPeriod] = useState("24h");
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileName = localStorage.getItem("dataset_file");

  const handleTrain = async () => {
    if (!fileName) {
      alert("Please upload dataset first");
      return;
    }

    try {
      setLoading(true);
      await API.post(`/train/${fileName}`);
      alert("Model trained successfully");
    } catch (error) {
      alert(error.response?.data?.detail || "Training failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForecast = async () => {
    if (!fileName) {
      alert("Please upload dataset first");
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/forecast/${fileName}?period=${period}`);
      setForecastData(response.data.data);
    } catch (error) {
      alert(error.response?.data?.detail || "Forecast failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Energy Forecasting"
        subtitle="Train the model and generate future energy consumption predictions for 24 hours, 7 days or 30 days."
        />

      <div className="action-bar">
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="24h">Next 24 Hours</option>
            <option value="7d">Next 7 Days</option>
            <option value="30d">Next 30 Days</option>
        </select>

        <button onClick={handleTrain} disabled={loading}>Train Model</button>
        <button onClick={handleForecast} disabled={loading}>Generate Forecast</button>
        </div>

      {forecastData && (
        <>
          <ForecastChart data={forecastData} />

          <div className="card">
            <h3>Forecast Table</h3>
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Predicted Usage</th>
                </tr>
              </thead>
              <tbody>
                {forecastData.forecast.map((item, index) => (
                  <tr key={index}>
                    <td>{item.timestamp}</td>
                    <td>{item.predicted_energy_usage} kWh</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Forecast;