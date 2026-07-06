import { useState } from "react";
import API from "../api/api";
import PageHeader from "../components/PageHeader";

function Simulation() {
  const fileName = localStorage.getItem("dataset_file");

  const [formData, setFormData] = useState({
    occupancy_change: 0,
    temperature_change: 0,
    device_shutdown: false,
    peak_reduction_percent: 0,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : Number(value),
    });
  };

  const runSimulation = async () => {
    if (!fileName) {
      alert("Upload dataset first.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        `/simulation/${fileName}`,
        formData
      );

      setResult(response.data);
    } catch (error) {
      alert(error.response?.data?.detail || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <PageHeader
  title="Scenario Simulation"
  subtitle="Simulate occupancy, temperature, device shutdown and peak-load reduction scenarios."
/>

      <div className="card">

        <div className="form-group">
          <label>Occupancy Change (%)</label>

          <input
            type="number"
            name="occupancy_change"
            value={formData.occupancy_change}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Temperature Change (°C)</label>

          <input
            type="number"
            name="temperature_change"
            value={formData.temperature_change}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Peak Load Reduction (%)</label>

          <input
            type="number"
            name="peak_reduction_percent"
            value={formData.peak_reduction_percent}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">

          <label>

            <input
              type="checkbox"
              name="device_shutdown"
              checked={formData.device_shutdown}
              onChange={handleChange}
            />

            Shutdown Device

          </label>

        </div>

        <button
          onClick={runSimulation}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Simulation"}
        </button>

      </div>

      {result && (

        <div className="card">

          <h3>Simulation Result</h3>

          <table>

            <tbody>

              <tr>
                <td>Original Consumption</td>
                <td>{result.original_consumption} kWh</td>
              </tr>

              <tr>
                <td>Simulated Consumption</td>
                <td>{result.simulated_consumption} kWh</td>
              </tr>

              <tr>
                <td>Energy Savings</td>
                <td>{result.energy_savings} kWh</td>
              </tr>

              <tr>
                <td>Savings Percentage</td>
                <td>{result.savings_percent}%</td>
              </tr>

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default Simulation;