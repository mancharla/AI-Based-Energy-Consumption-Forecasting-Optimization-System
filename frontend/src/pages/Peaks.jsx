import { useState } from "react";
import API from "../api/api";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

function Peaks() {
  const fileName = localStorage.getItem("dataset_file");
  const [period, setPeriod] = useState("24h");
  const [peaks, setPeaks] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadPeaks = async () => {
    if (!fileName) {
      alert("Upload dataset first.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/peaks/${fileName}?period=${period}`);
      setPeaks(response.data.peaks);
    } catch (error) {
      alert(error.response?.data?.detail || "Peak prediction failed");
    } finally {
      setLoading(false);
    }
    {!peaks && (
  <EmptyState
    title="No peak prediction yet"
    message="Choose a forecast period and click Predict Peak Usage."
  />
)}
  };

  return (
    <div>
      <PageHeader
        title="Peak Usage Prediction"
        subtitle="Predict high-load periods and detect expected peak consumption windows."
      />

      <div className="card">
        <p><strong>Dataset:</strong> {fileName || "No dataset uploaded"}</p>

        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="24h">Next 24 Hours</option>
          <option value="7d">Next 7 Days</option>
          <option value="30d">Next 30 Days</option>
        </select>

        <button onClick={loadPeaks} disabled={loading}>
          {loading ? "Loading..." : "Predict Peak Usage"}
        </button>
      </div>

      {peaks && (
        <div className="card">
          <h3>Peak Summary</h3>
          <p><strong>Average Usage:</strong> {peaks.average_usage} kWh</p>
          <p><strong>Threshold:</strong> {peaks.threshold} kWh</p>

          <h3>Alerts</h3>
          {peaks.alerts.length === 0 ? (
            <p>No peak periods detected.</p>
          ) : (
            peaks.alerts.map((alert, index) => (
              <div className="alert warning" key={index}>{alert}</div>
            ))
          )}

          <h3>Peak Periods</h3>
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Predicted Usage</th>
                <th>Threshold</th>
              </tr>
            </thead>
            <tbody>
              {peaks.peak_periods.map((item, index) => (
                <tr key={index}>
                  <td>{item.timestamp}</td>
                  <td>{item.predicted_energy_usage} kWh</td>
                  <td>{item.threshold} kWh</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Peaks;