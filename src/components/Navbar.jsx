import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="dashboard-navbar">
      <div className="navbar-brand">
        <div className="logo-icon-small">
          <svg width="35" height="35" viewBox="0 0 60 60" fill="none">
            <path d="M30 10L50 20V40L30 50L10 40V20L30 10Z" stroke="#667eea" strokeWidth="3"/>
            <circle cx="30" cy="30" r="8" fill="#667eea"/>
          </svg>
        </div>
        <h2>Lynqio</h2>
      </div>

      <div className="navbar-center">
        <div className="search-bar">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Search links..." />
        </div>
      </div>

      <div className="navbar-actions">
        <button className="btn-icon" title="Notifications">
          <i className="bi bi-bell"></i>
          <span className="notification-badge">3</span>
        </button>
        
        <div className="user-profile-dropdown">
          <img 
            src="https://ui-avatars.com/api/?name=John+Doe&background=667eea&color=fff" 
            alt="User" 
            className="user-avatar"
          />
          <span className="user-name">John Doe</span>
          <i className="bi bi-chevron-down"></i>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;