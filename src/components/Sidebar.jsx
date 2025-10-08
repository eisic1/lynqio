import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  //const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: 'bi-grid', label: 'Dashboard' },
    { path: '/editor', icon: 'bi-pencil-square', label: 'Link Editor' },
    { path: '/analytics', icon: 'bi-graph-up', label: 'Analytics' },
    { path: '/appearance', icon: 'bi-palette', label: 'Appearance' },
    { path: '/settings', icon: 'bi-gear', label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="profile-link-preview">
          <p className="preview-label">Your Link</p>
          <div className="preview-url">
            <i className="bi bi-link-45deg"></i>
            <span>lynqio.com/johndoe</span>
            <button className="btn-copy" title="Copy Link">
              <i className="bi bi-clipboard"></i>
            </button>
          </div>
        </div>

        <button className="btn-logout">
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;