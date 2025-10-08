import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import LinkCard from '../components/LinkCard';
import '../styles/Dashboard.css';

function Dashboard() {
  // Mock data - kasnije će doći iz backend-a
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
              <h1>Welcome back, John! 👋</h1>
              <p>Here's what's happening with your links today</p>
            </div>
            <button className="btn-primary-gradient">
              <i className="bi bi-plus-lg"></i>
              Add New Link
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <StatsCard 
              icon="bi-link-45deg"
              label="Total Links"
              value="24"
              trend="up"
              trendValue="+3 this month"
            />
            <StatsCard 
              icon="bi-eye"
              label="Total Views"
              value="12.5K"
              trend="up"
              trendValue="+12.5%"
            />
            <StatsCard 
              icon="bi-mouse"
              label="Total Clicks"
              value="3.2K"
              trend="up"
              trendValue="+8.3%"
            />
            <StatsCard 
              icon="bi-graph-up-arrow"
              label="Click Rate"
              value="25.6%"
              trend="down"
              trendValue="-2.1%"
            />
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="quick-action-btn">
              <i className="bi bi-eye"></i>
              <span>View Profile</span>
            </button>
            <button className="quick-action-btn">
              <i className="bi bi-share"></i>
              <span>Share Link</span>
            </button>
            <button className="quick-action-btn">
              <i className="bi bi-download"></i>
              <span>Export Data</span>
            </button>
          </div>

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
    </div>
  );
}

export default Dashboard;