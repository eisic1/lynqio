import '../styles/StatsCard.css';

function StatsCard({ icon, label, value, trend, trendValue }) {
  return (
    <div className="stats-card">
      <div className="stats-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <div className="stats-info">
        <p className="stats-label">{label}</p>
        <h3 className="stats-value">{value}</h3>
        {trend && (
          <div className={`stats-trend ${trend}`}>
            <i className={`bi ${trend === 'up' ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;