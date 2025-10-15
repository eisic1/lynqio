import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { useToast } from '../components/toast/ToastContainer';
import '../styles/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profileData } = useProfile();
  const toast = useToast();

  const handleCopyLink = async () => {
    const profileUrl = `${window.location.origin}/${profileData.username}`;
    
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.showSuccess('🔗 Link copied to clipboard!');
    } catch (err) {
      // Fallback for old browsers
      const textArea = document.createElement('textarea');
      textArea.value = profileUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.showSuccess('🔗 Link copied to clipboard!');
      } catch (err) {
        toast.showError('❌ Failed to copy link');
      }
      document.body.removeChild(textArea);
    }
  };

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
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
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
            <span>lynqio.com/{profileData.username}</span>
            <button className="btn-copy" title="Copy Link" onClick={handleCopyLink}>
              <i className="bi bi-clipboard"></i>
            </button>
          </div>
        </div>

        <button className="btn-logout" onClick={() => navigate('/login')}>
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;