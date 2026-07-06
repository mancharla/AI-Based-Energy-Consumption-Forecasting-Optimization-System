function SummaryCards({ summary }) {
  const cards = [
    { label: "Total Consumption", value: `${summary.total_consumption} kWh` },
    { label: "Average Usage", value: `${summary.average_usage} kWh` },
    { label: "Maximum Usage", value: `${summary.maximum_usage} kWh` },
    { label: "Minimum Usage", value: `${summary.minimum_usage} kWh` },
    { label: "Buildings", value: summary.building_count },
    { label: "Devices", value: summary.device_count },
    { label: "Peak Hour", value: summary.peak_hour },
    { label: "Total Records", value: summary.total_records },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card, index) => (
        <div className="summary-card" key={index}>
          <p>{card.label}</p>
          <h3>{card.value}</h3>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;