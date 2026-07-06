function PeakAlerts({ peaks }) {
  if (!peaks) return null;

  return (
    <div className="card">
      <h3>🚨 Peak Usage Alerts</h3>

      <p>
        <strong>Average Usage:</strong> {peaks.average_usage} kWh
      </p>

      <p>
        <strong>Threshold:</strong> {peaks.threshold} kWh
      </p>

      <hr />

      {peaks.alerts.length === 0 ? (
        <p>No peak alerts detected.</p>
      ) : (
        peaks.alerts.map((alert, index) => (
          <div className="alert warning" key={index}>
            {alert}
          </div>
        ))
      )}
    </div>
  );
}

export default PeakAlerts;