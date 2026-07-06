function RecommendationPanel({ data }) {
  if (!data) return null;

  return (
    <div className="card">
      <h3>💡 AI Recommendations</h3>

      <p>
        Estimated Saving:
        <strong> {data.estimated_saving_percent}%</strong>
      </p>

      <hr />

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
  );
}

export default RecommendationPanel;