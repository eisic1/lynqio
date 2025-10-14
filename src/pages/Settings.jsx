import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useToast } from '../components/toast/ToastContainer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/Settings.css';

function Settings() {
  const { profileData, setProfileData } = useProfile();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    username: profileData.username,
    displayName: profileData.displayName,
    email: 'esmir@example.com',
    bio: profileData.bio,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileVisibility: 'public',
    showAnalytics: true,
    seoIndexing: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setProfileData({
        ...profileData,
        username: formData.username,
        displayName: formData.displayName,
        bio: formData.bio
      });
      toast.showSuccess('✅ Profile updated successfully!');
      setIsSaving(false);
    }, 1000);
  };

  const handleChangePassword = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.showError('❌ Please fill in all password fields');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.showError('❌ Passwords do not match');
      return;
    }
    toast.showSuccess('✅ Password changed successfully!');
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleDeleteAccount = () => {
    toast.showSuccess('🗑️ Account deleted');
    setShowDeleteConfirm(false);
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        
        <main className="settings-main">
          <div className="settings-layout">
            
            {/* Left Sidebar - Tabs */}
            <aside className="settings-sidebar">
              <h1 className="settings-title">Settings</h1>
              
              <nav className="settings-nav">
                <button
                  className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </button>
                <button
                  className={`settings-nav-item ${activeTab === 'account' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account')}
                >
                  Account
                </button>
                <button
                  className={`settings-nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('privacy')}
                >
                  Privacy
                </button>
                <button
                  className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  Security
                </button>
                <button
                  className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  Notifications
                </button>
              </nav>
            </aside>

            {/* Right Content Area */}
            <div className="settings-content">
              
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="settings-section">
                  <div className="section-header">
                    <h2>Profile Information</h2>
                    <p>Manage your public profile details</p>
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="displayName">Display Name</label>
                      <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        placeholder="Your Name"
                      />
                      <small>This is how your name will appear on your profile</small>
                    </div>

                    <div className="form-field">
                      <label htmlFor="username">Username</label>
                      <div className="input-with-prefix">
                        <span className="input-prefix">lynqio.com/</span>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="yourusername"
                        />
                      </div>
                      <small>Your unique profile URL</small>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell people about yourself..."
                      rows="4"
                    />
                    <small>{formData.bio.length}/150 characters</small>
                  </div>

                  <button 
                    className="btn-save"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}

              {/* ACCOUNT TAB */}
              {activeTab === 'account' && (
                <div className="settings-section">
                  <div className="section-header">
                    <h2>Account Settings</h2>
                    <p>Manage your account details and preferences</p>
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                    />
                    <small>We'll never share your email with anyone</small>
                  </div>

                  <div className="form-field">
                    <label>Account Type</label>
                    <select className="form-select">
                      <option>Free Plan</option>
                      <option>Pro Plan - $9/month</option>
                      <option>Business Plan - $29/month</option>
                    </select>
                  </div>

                  <button className="btn-save">Save Changes</button>

                  <div className="divider"></div>

                  <div className="danger-zone">
                    <h3>Delete Account</h3>
                    <p>Permanently delete your account and all data. This action cannot be undone.</p>
                    <button 
                      className="btn-danger"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {/* PRIVACY TAB */}
              {activeTab === 'privacy' && (
                <div className="settings-section">
                  <div className="section-header">
                    <h2>Privacy Settings</h2>
                    <p>Control who can see your profile and data</p>
                  </div>

                  <div className="toggle-list">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <h3>Public Profile</h3>
                        <p>Make your profile visible to everyone on the internet</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={formData.profileVisibility === 'public'}
                          onChange={(e) => setFormData({
                            ...formData,
                            profileVisibility: e.target.checked ? 'public' : 'private'
                          })}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <h3>Show Analytics</h3>
                        <p>Display click counts and view statistics on your profile</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          name="showAnalytics"
                          checked={formData.showAnalytics}
                          onChange={handleChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <h3>SEO Indexing</h3>
                        <p>Allow search engines to index your profile</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          name="seoIndexing"
                          checked={formData.seoIndexing}
                          onChange={handleChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <button className="btn-save">Save Preferences</button>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <div className="settings-section">
                  <div className="section-header">
                    <h2>Security Settings</h2>
                    <p>Manage your password and account security</p>
                  </div>

                  <div className="form-field">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                    <small>Must be at least 8 characters</small>
                  </div>

                  <div className="form-field">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <button className="btn-save" onClick={handleChangePassword}>
                    Change Password
                  </button>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div className="settings-section">
                  <div className="section-header">
                    <h2>Notification Preferences</h2>
                    <p>Choose what notifications you want to receive</p>
                  </div>

                  <div className="toggle-list">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <h3>Email Notifications</h3>
                        <p>Receive email updates about your account activity</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <h3>Weekly Summary</h3>
                        <p>Get a weekly summary of your link performance</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <h3>Marketing Emails</h3>
                        <p>Receive tips, updates, and promotional content</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <button className="btn-save">Save Preferences</button>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>

      {/* Confirm Delete Modal */}
      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Account?"
          message="This will permanently delete all your data. This action cannot be undone."
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmText="Yes, Delete My Account"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
}

export default Settings;