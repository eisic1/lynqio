import '../styles/LinkCard.css';

function LinkCard({ link }) {
  return (
    <div className="link-card">
      <div className="link-icon">
        <i className={`bi ${link.icon}`}></i>
      </div>
      <div className="link-info">
        <h4>{link.title}</h4>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-url">
          {link.url}
        </a>
        <div className="link-stats-mini">
          <span>
            <i className="bi bi-eye"></i> {link.views} views
          </span>
          <span>
            <i className="bi bi-mouse"></i> {link.clicks} clicks
          </span>
        </div>
      </div>
      <div className="link-actions">
        <button className="btn-action" title="Edit">
          <i className="bi bi-pencil"></i>
        </button>
        <button className="btn-action" title="Analytics">
          <i className="bi bi-bar-chart"></i>
        </button>
        <button className="btn-action btn-delete" title="Delete">
          <i className="bi bi-trash"></i>
        </button>
        <div className="link-toggle">
          <label className="switch">
            <input type="checkbox" defaultChecked={link.active} />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default LinkCard;