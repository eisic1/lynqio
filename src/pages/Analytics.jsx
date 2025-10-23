import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsAPI } from '../api/analytics';
import { useToast } from '../components/toast/ToastContainer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Analytics.css';

function Analytics() {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7'); // 7, 14, 30 days

  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      total_views: 0,
      total_clicks: 0,
      active_links: 0,
      total_links: 0,
      click_rate: 0
    },
    topLinks: [],
    allLinks: [],
    timeline: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch complete analytics
      const response = await analyticsAPI.getCompleteAnalytics();

      if (response.success) {
        setAnalyticsData({
          overview: response.data.overview,
          topLinks: response.data.top_links,
          allLinks: response.data.all_links,
          timeline: response.data.timeline
        });
      }
    } catch (error) {
      console.error('Fetch analytics error:', error);
      toast.showError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    toast.showInfo('Export feature coming soon!');
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-container">
          <Sidebar />
          <main className="analytics-main">
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading analytics...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        
        <main className="analytics-main">
          
          {/* Header */}
          <div className="analytics-header">
            <div>
              <h1>📊 Analytics</h1>
              <p>Track your profile performance and link engagement</p>
            </div>
            <div className="analytics-header-actions">
              <select 
                className="date-range-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
              </select>
              <button className="btn-export" onClick={handleExportReport}>
                <i className="bi bi-download me-2"></i>
                Export Report
              </button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="analytics-overview">
            <div className="overview-card">
              <div className="overview-icon views">
                <i className="bi bi-eye"></i>
              </div>
              <div className="overview-content">
                <span className="overview-label">Total Views</span>
                <h3 className="overview-value">{analyticsData.overview.total_views.toLocaleString()}</h3>
                <span className="overview-trend positive">
                  <i className="bi bi-arrow-up"></i> All time
                </span>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon clicks">
                <i className="bi bi-mouse"></i>
              </div>
              <div className="overview-content">
                <span className="overview-label">Total Clicks</span>
                <h3 className="overview-value">{analyticsData.overview.total_clicks.toLocaleString()}</h3>
                <span className="overview-trend positive">
                  <i className="bi bi-arrow-up"></i> All time
                </span>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon rate">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <div className="overview-content">
                <span className="overview-label">Click Rate</span>
                <h3 className="overview-value">{analyticsData.overview.click_rate}%</h3>
                <span className={`overview-trend ${analyticsData.overview.click_rate > 30 ? 'positive' : analyticsData.overview.click_rate > 20 ? 'neutral' : 'negative'}`}>
                  <i className={`bi bi-arrow-${analyticsData.overview.click_rate > 20 ? 'up' : 'down'}`}></i>
                  {analyticsData.overview.click_rate > 30 ? 'Excellent' : analyticsData.overview.click_rate > 20 ? 'Good' : 'Needs work'}
                </span>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon links">
                <i className="bi bi-link-45deg"></i>
              </div>
              <div className="overview-content">
                <span className="overview-label">Active Links</span>
                <h3 className="overview-value">
                  {analyticsData.overview.active_links}/{analyticsData.overview.total_links}
                </h3>
                <span className="overview-trend neutral">
                  <i className="bi bi-circle-fill"></i> Total links
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="analytics-section">
            <div className="section-header">
              <h2>📈 Views & Clicks Over Time</h2>
              <span className="section-subtitle">Last {dateRange} days performance</span>
            </div>
            <div className="chart-container">
              {analyticsData.timeline.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={analyticsData.timeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#718096"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#718096"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#667eea" 
                      strokeWidth={3}
                      dot={{ fill: '#667eea', r: 5 }}
                      activeDot={{ r: 7 }}
                      name="Views"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#48bb78" 
                      strokeWidth={3}
                      dot={{ fill: '#48bb78', r: 5 }}
                      activeDot={{ r: 7 }}
                      name="Clicks"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">
                  <i className="bi bi-graph-up"></i>
                  <p>No data available for the selected period</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Links & All Links */}
          <div className="analytics-grid">
            
            {/* Top Links Bar Chart */}
            <div className="analytics-section">
              <div className="section-header">
                <h2>🏆 Top Performing Links</h2>
                <span className="section-subtitle">Most clicked links</span>
              </div>
              <div className="chart-container">
                {analyticsData.topLinks.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.topLinks}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="title" 
                        stroke="#718096"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        stroke="#718096"
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="click_count" 
                        fill="#667eea" 
                        radius={[8, 8, 0, 0]}
                        name="Clicks"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="no-data">
                    <i className="bi bi-bar-chart"></i>
                    <p>No link data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* All Links Performance Table */}
            <div className="analytics-section">
              <div className="section-header">
                <h2>📋 Link Performance</h2>
                <span className="section-subtitle">All links overview</span>
              </div>
              <div className="table-container">
                {analyticsData.allLinks.length > 0 ? (
                  <table className="performance-table">
                    <thead>
                      <tr>
                        <th>Link</th>
                        <th className='text-center'>Clicks</th>
                        <th>Share</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.allLinks.map((link) => (
                        <tr key={link.id}>
                          <td>
                            <div className="link-info">
                              <i className={`bi ${link.icon || 'bi-link-45deg'} link-icon`}></i>
                              <div className="link-details">
                                <span className="link-title">{link.title}</span>
                                <span className="link-url">{link.url}</span>
                              </div>
                            </div>
                          </td>
                          <td className='text-center'>
                            <span className="click-count">{link.click_count}</span>
                          </td>
                          <td>
                            <div className="percentage-bar">
                              <div 
                                className="percentage-fill" 
                                style={{ width: `${link.click_percentage}%` }}
                              ></div>
                              <span className="percentage-text">{link.click_percentage}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${link.is_active ? 'active' : 'inactive'}`}>
                              {link.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-data">
                    <i className="bi bi-table"></i>
                    <p>No links found</p>
                    <button className="btn-add-link" onClick={() => navigate('/editor')}>
                      <i className="bi bi-plus-lg me-2"></i>
                      Add Your First Link
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default Analytics;