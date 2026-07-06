function AnomalyPanel({ data }) {
  if (!data) return null;

  return (
    <div className="card">
      <h3>⚠️ Energy Anomalies</h3>

      <p>
        Total Records: <strong>{data.total_records}</strong>
      </p>

      <p>
        Total Anomalies: <strong>{data.anomaly_count}</strong>
      </p>

      <hr />

      {data.anomalies.slice(0, 5).map((item, index) => (
        <div key={index} className="anomaly-item">
          <p>
            <strong>{item.device_id}</strong>
          </p>

          <p>{item.timestamp}</p>

          <p>{item.energy_usage} kWh</p>
        </div>
      ))}
    </div>
  );
}

export default AnomalyPanel;