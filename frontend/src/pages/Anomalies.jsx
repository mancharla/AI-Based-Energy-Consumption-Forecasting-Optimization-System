import { useState } from "react";
import API from "../api/api";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

function Anomalies() {
  const fileName = localStorage.getItem("dataset_file");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadAnomalies = async () => {
    if (!fileName) {
      alert("Upload dataset first.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/anomalies/${fileName}`);
      setData(response.data);
    } catch (error) {
      alert(error.response?.data?.detail || "Anomaly detection failed");
    } finally {
      setLoading(false);
    }
    {!data && (
    <EmptyState
        title="No anomalies detected yet"
        message="Click Detect Anomalies to scan your uploaded dataset."
    />
    )}
  };

  return (
    <div>
      <PageHeader
        title="Anomaly Detection"
        subtitle="Detect abnormal spikes, night-time usage and unusual device behavior."
        />

      <div className="card">
        <p><strong>Dataset:</strong> {fileName || "No dataset uploaded"}</p>

        <button onClick={loadAnomalies} disabled={loading}>
          {loading ? "Loading..." : "Detect Anomalies"}
        </button>
      </div>

      {data && (
        <div className="card">
          <h3>Anomaly Summary</h3>
          <p><strong>Total Records:</strong> {data.total_records}</p>
          <p><strong>Anomaly Count:</strong> {data.anomaly_count}</p>

          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Building</th>
                <th>Device</th>
                <th>Energy Usage</th>
              </tr>
            </thead>

            <tbody>
              {data.anomalies.map((item, index) => (
                <tr key={index}>
                  <td>{item.timestamp}</td>
                  <td>{item.building_id}</td>
                  <td>{item.device_id}</td>
                  <td>{item.energy_usage} kWh</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Anomalies;