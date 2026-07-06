import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

function ForecastChart({ data }) {
  const historical = data.historical.map((item) => ({
    timestamp: item.timestamp,
    actual: item.energy_usage,
    predicted: null,
  }));

  const forecast = data.forecast.map((item) => ({
    timestamp: item.timestamp,
    actual: null,
    predicted: item.predicted_energy_usage,
  }));

  const chartData = [...historical, ...forecast];

  return (
    <div className="card">
      <h3>Historical vs Predicted Energy Usage</h3>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" hide />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" strokeWidth={2} />
          <Line type="monotone" dataKey="predicted" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ForecastChart;