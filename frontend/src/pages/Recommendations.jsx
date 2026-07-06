import { useState } from "react";
import API from "../api/api";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

function Recommendations() {
  const fileName = localStorage.getItem("dataset_file");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadRecommendations = async () => {
    if (!fileName) {
      alert("Upload dataset first.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/recommendations/${fileName}`);
      setData(response.data);
    } catch (error) {
      alert(error.response?.data?.detail || "Recommendations failed");
    } finally {
      setLoading(false);
    }
    {!data && (
  <EmptyState
    title="No recommendations generated"
    message="Click Generate Recommendations to receive AI-based optimization suggestions."
  />
)}
  };

  return (
    <div>
      <PageHeader
  title="AI Optimization Recommendations"
  subtitle="Generate smart energy-saving actions based on consumption, occupancy and peak patterns."
/>
      <div className="card">
        <p>
          <strong>Dataset:</strong> {fileName || "No dataset uploaded"}
        </p>

        <button onClick={loadRecommendations} disabled={loading}>
          {loading ? "Loading..." : "Generate Recommendations"}
        </button>
      </div>

      {data && (
        <div className="card">
          <h3>Optimization Summary</h3>

          <p>
            <strong>Average Usage:</strong> {data.average_usage} kWh
          </p>

          <p>
            <strong>Maximum Usage:</strong> {data.maximum_usage} kWh
          </p>

          <p>
            <strong>Estimated Saving:</strong>{" "}
            {data.estimated_saving_percent}%
          </p>

          <h3>Recommendations</h3>

          {data.recommendations.map((item, index) => (
            <div className="recommendation" key={index}>
              <h4>{item.type}</h4>
              <p>{item.message}</p>

              <span className={`priority ${item.priority.toLowerCase()}`}>
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recommendations;