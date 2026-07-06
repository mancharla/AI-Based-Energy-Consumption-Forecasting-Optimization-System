import {
  ResponsiveContainer,
  AreaChart,
  Area,
 XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function HourlyChart({ data }) {
  return (
    <div className="card">
      <h3>Hourly Energy Usage</h3>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3"/>

          <XAxis dataKey="hour"/>

          <YAxis/>

          <Tooltip/>

          <Area
            dataKey="energy_usage"
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>

    </div>
  );
}

export default HourlyChart;