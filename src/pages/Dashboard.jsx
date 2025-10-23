import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { QRCodeCanvas } from 'qrcode.react';
import { profileAPI } from '../api/profile';
import { analyticsAPI } from '../api/analytics';
import { useToast } from '../components/toast/ToastContainer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import LinkCard from '../components/LinkCard';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const [userData, setUserData] = useState({
    name: '',
    username: ''
  });
  const [showQRModal, setShowQRModal] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    total_views: 0,
    total_clicks: 0,
    active_links: 0,
    total_links: 0,
    click_rate: 0,
    loading: true
  });

  const handleViewProfile = () => {
    navigate(`/${userData.username}`);
  };

  useEffect(() => {
    loadUserData();
    fetchAnalyticsData();
  }, []);

  const loadUserData = async () => {
    try {
      // Učitaj iz localStorage
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        const user = JSON.parse(userFromStorage);
        
        setUserData({
          name: user.full_name || user.username || 'User',
          username: user.username || ''
        });
      }
    } catch (error) {
      console.error('Load user data error:', error);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await analyticsAPI.getOverview();
      
      if (response.success) {
        setAnalyticsData({
          ...response.data,
          loading: false
        });
      }
    } catch (error) {
      console.error('Fetch analytics error:', error);
      setAnalyticsData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleShowQR = () => {
    setShowQRModal(true);
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${userData.username}-qr-code.png`;
      link.href = url;
      link.click();
      toast.showSuccess('✅ QR Code downloaded!');
    }
  };

  const handleCopyQRLink = () => {
    const profileUrl = `${window.location.origin}/${userData.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast.showSuccess('🔗 Profile link copied to clipboard!');
  };

  const profileUrl = `${window.location.origin}/${userData.username}`;

  const [links] = useState([
    {
      id: 1,
      title: 'My Portfolio',
      url: 'https://johndoe.com',
      icon: 'bi-briefcase',
      views: 1234,
      clicks: 456,
      active: true
    },
    {
      id: 2,
      title: 'Instagram',
      url: 'https://instagram.com/johndoe',
      icon: 'bi-instagram',
      views: 5678,
      clicks: 890,
      active: true
    },
    {
      id: 3,
      title: 'YouTube Channel',
      url: 'https://youtube.com/@johndoe',
      icon: 'bi-youtube',
      views: 3456,
      clicks: 678,
      active: true
    },
    {
      id: 4,
      title: 'Buy Me a Coffee',
      url: 'https://buymeacoffee.com/johndoe',
      icon: 'bi-cup-hot',
      views: 890,
      clicks: 123,
      active: false
    },
  ]);

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        
        <main className="dashboard-main">
          {/* Header sekcija */}
          <div className="dashboard-header">
            <div>
              <h1>Welcome back, {userData.name}! 👋</h1>
              <p>Here's what's happening with your links today</p>
            </div>
            <button className="btn-primary-gradient" onClick={() => navigate('/editor')}>
              <i className="bi bi-plus-lg"></i>
              Add New Link
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            {analyticsData.loading ? (
              // Loading skeleton
              <>
                <div className="stats-card-skeleton"></div>
                <div className="stats-card-skeleton"></div>
                <div className="stats-card-skeleton"></div>
                <div className="stats-card-skeleton"></div>
              </>
            ) : (
              <>
                <StatsCard 
                  icon="bi-eye"
                  label="Total Views"
                  value={analyticsData.total_views.toLocaleString()}
                  trend="neutral"
                  trendValue="All time"
                />
                <StatsCard 
                  icon="bi-mouse"
                  label="Total Clicks"
                  value={analyticsData.total_clicks.toLocaleString()}
                  trend="neutral"
                  trendValue="All time"
                />
                <StatsCard 
                  icon="bi-graph-up-arrow"
                  label="Click Rate"
                  value={`${analyticsData.click_rate}%`}
                  trend={analyticsData.click_rate > 30 ? "up" : analyticsData.click_rate > 20 ? "neutral" : "down"}
                  trendValue={analyticsData.click_rate > 30 ? "Excellent" : analyticsData.click_rate > 20 ? "Good" : "Needs improvement"}
                />
                <StatsCard 
                  icon="bi-link-45deg"
                  label="Active Links"
                  value={`${analyticsData.active_links}/${analyticsData.total_links}`}
                  trend="neutral"
                  trendValue="Total links"
                />
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={handleViewProfile}>
              <i className="bi bi-eye"></i>
              <span>View Profile</span>
            </button>
            {/*<button className="quick-action-btn">
              <i className="bi bi-share"></i>
              <span>Share Link</span>
            </button>*/}
            <button className="quick-action-btn" onClick={handleShowQR}>
              <i className="bi bi-qr-code"></i>
              <span>QR Code</span>
            </button>
            <button className="quick-action-btn">
              <i className="bi bi-download"></i>
              <span>Export Data</span>
            </button>
          </div>


          {/* Analytics Link - DODAJ OVO */}
          {/*<div className="analytics-preview mb-5">
            <div className="analytics-preview-header">
              <h3>📊 Performance Overview</h3>
              <button 
                className="btn-link-analytics"
                onClick={() => navigate('/analytics')}
              >
                View Detailed Analytics
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div> */}

          {/* Links Section */}
          <div className="links-section">
            <div className="section-header">
              <h2>Your Links</h2>
              <div className="section-actions">
                <button className="btn-filter">
                  <i className="bi bi-funnel"></i>
                  Filter
                </button>
                <button className="btn-filter">
                  <i className="bi bi-sort-down"></i>
                  Sort
                </button>
              </div>
            </div>

            <div className="links-list">
              {links.map((link) => (
                <LinkCard key={link.id} link={link} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* QR Code Modal - DODAJ OVO */}
      {showQRModal && (
        <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h2>Profile QR Code</h2>
              <button 
                className="btn-close-modal"
                onClick={() => setShowQRModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="qr-modal-body">
              <div className="qr-code-container">
                <QRCodeCanvas
                  id="qr-code-canvas"
                  value={profileUrl}
                  size={280}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="qr-info">
                <p className="qr-url">{profileUrl}</p>
                <p className="qr-description">
                  Scan this QR code to visit your profile
                </p>
              </div>

              <div className="qr-actions">
                <button 
                  className="btn-secondary"
                  onClick={handleCopyQRLink}
                >
                  <i className="bi bi-link-45deg me-2"></i>
                  Copy Link
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleDownloadQR}
                >
                  <i className="bi bi-download me-2"></i>
                  Download QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;