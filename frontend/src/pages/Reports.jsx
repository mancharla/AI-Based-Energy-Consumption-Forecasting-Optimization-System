import { useState } from "react";
import API from "../api/api";
import PageHeader from "../components/PageHeader";

function Reports() {
  const fileName = localStorage.getItem("dataset_file");
  const [metrics, setMetrics] = useState(null);

  const downloadFile = async (url, filename) => {
    try {
      const response = await API.get(url, {
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert(error.response?.data?.detail || "Download failed");
    }
  };

  const getMetrics = async () => {
    if (!fileName) {
      alert("Upload dataset first.");
      return;
    }

    try {
      const response = await API.get(`/metrics/${fileName}`);
      setMetrics(response.data);
    } catch (error) {
      alert(error.response?.data?.detail || "Metrics loading failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Reports & Model Metrics"
        subtitle="Download forecast reports, analytics PDF and compare model performance."
        />
      <div className="card">
        <p>
          <strong>Dataset:</strong> {fileName || "No dataset uploaded"}
        </p>

        <button
          onClick={() =>
            downloadFile(
              `/reports/forecast-csv/${fileName}?period=24h`,
              "forecast_report.csv"
            )
          }
        >
          Download Forecast CSV
        </button>

        <button
          onClick={() =>
            downloadFile(
              `/reports/analytics-pdf/${fileName}`,
              "analytics_report.pdf"
            )
          }
        >
          Download Analytics PDF
        </button>

        <button onClick={getMetrics}>View Model Metrics</button>
      </div>

      {metrics && (
        <div className="card">
          <h3>Best Model: {metrics.best_model}</h3>

          <p>
            <strong>Features Used:</strong>{" "}
            {metrics.feature_columns?.join(", ")}
          </p>

          <h3>Model Comparison</h3>

          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>MAE</th>
                <th>RMSE</th>
                <th>MAPE</th>
                <th>R² Score</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(metrics.metrics || {}).map(([model, values]) => (
                <tr key={model}>
                  <td>{model}</td>
                  <td>{values.mae}</td>
                  <td>{values.rmse}</td>
                  <td>{values.mape}%</td>
                  <td>{values.r2_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reports;