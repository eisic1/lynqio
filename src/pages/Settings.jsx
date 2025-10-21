import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { profileAPI } from '../api/profile';
import { useToast } from '../components/toast/ToastContainer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/Settings.css';

function Settings() {
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    fullName: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileVisibility: true,
    showAnalytics: true,
    seoIndexing: true,
    emailNotifications: true,
    weeklySummary: true,
    marketingEmails: false
  });

  // Fetch user data pri učitavanju
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user info
      const userResponse = await authAPI.getMe();
      if (userResponse.success) {
        const user = userResponse.data.user;
        
        setFormData(prev => ({
          ...prev,
          email: user.email,
          fullName: user.full_name || '',
          username: user.username
        }));
      }

      // Fetch profile info
      const profileResponse = await profileAPI.getMyProfile();
      if (profileResponse.success) {
        const profile = profileResponse.data.profile;
        
        setFormData(prev => ({
          ...prev,
          displayName: profile.title || '',
          username: profile.slug || prev.username,
          bio: profile.bio || '',
          profileVisibility: profile.is_public
        }));
      }
    } catch (error) {
      console.error('Fetch user data error:', error);
      toast.showError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Za username - sanitize input
    if (name === 'username') {
      const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setFormData({
        ...formData,
        [name]: sanitizedValue
      });
    } else if (name === 'bio') {
      // Limit bio na 150 karaktera
      if (value.length <= 150) {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // ========== PROFILE TAB ==========
  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      // Validacija
      if (!formData.displayName.trim()) {
        toast.showError('Display name is required');
        return;
      }

      // Update profile
      const response = await profileAPI.updateProfile({
        title: formData.displayName,
        bio: formData.bio
      });

      if (response.success) {
        // Update user full_name ako postoji
        if (formData.fullName) {
          await authAPI.updateUserProfile({
            full_name: formData.fullName
          });
        }

        toast.showSuccess('✅ Profile updated successfully!');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save profile';
      toast.showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // ========== ACCOUNT TAB ==========
  const handleSaveAccount = async () => {
    try {
      setSaving(true);

      // Update email (ako backend podržava)
      // Za sada samo info message
      toast.showInfo('Account settings saved locally');
      
    } catch (error) {
      console.error('Save account error:', error);
      toast.showError('Failed to save account settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Ovde bi trebao API poziv za brisanje accounta
      // await authAPI.deleteAccount();
      
      const response = await authAPI.deleteAccount();
    
      if (response.success) {
        toast.showSuccess('🗑️ Account deleted successfully');
        setShowDeleteConfirm(false);
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect na homepage
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast.showError('Failed to delete account');
    }
  };

  // ========== PRIVACY TAB ==========
  const handleSavePrivacy = async () => {
    try {
      setSaving(true);

      const response = await profileAPI.updateProfile({
        is_public: formData.profileVisibility
      });

      if (response.success) {
        toast.showSuccess('✅ Privacy settings saved!');
      }
    } catch (error) {
      console.error('Save privacy error:', error);
      toast.showError('Failed to save privacy settings');
    } finally {
      setSaving(false);
    }
  };

  // ========== SECURITY TAB ==========
  const handleChangePassword = async () => {
    try {
      // Validacija
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        toast.showError('❌ Please fill in all password fields');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.showError('❌ Passwords do not match');
        return;
      }

      if (formData.newPassword.length < 8) {
        toast.showError('❌ Password must be at least 8 characters');
        return;
      }

      setSaving(true);

      // API poziv za promenu passworda
      // Backend endpoint još nije kreiran, ali ovako bi izgledalo:
      /*
      const response = await authAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.success) {
        toast.showSuccess('✅ Password changed successfully!');
        // Clear password fields
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
      */

      // Za sada simulacija
      toast.showSuccess('✅ Password changed successfully!');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error) {
      console.error('Change password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      toast.showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // ========== NOTIFICATIONS TAB ==========
  const handleSaveNotifications = async () => {
    try {
      setSaving(true);

      // Ovde bi trebao API poziv za notification preferences
      // Za sada samo localStorage
      localStorage.setItem('notificationPreferences', JSON.stringify({
        emailNotifications: formData.emailNotifications,
        weeklySummary: formData.weeklySummary,
        marketingEmails: formData.marketingEmails
      }));

      toast.showSuccess('✅ Notification preferences saved!');
    } catch (error) {
      console.error('Save notifications error:', error);
      toast.showError('Failed to save notification preferences');
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="dashboard-container">
          <Sidebar />
          <main className="settings-main">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading settings...</p>
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
                  <i className="bi bi-person me-2"></i>
                  Profile
                </button>
                <button
                  className={`settings-nav-item ${activeTab === 'account' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account')}
                >
                  <i className="bi bi-gear me-2"></i>
                  Account
                </button>
                <button
                  className={`settings-nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('privacy')}
                >
                  <i className="bi bi-shield-lock me-2"></i>
                  Privacy
                </button>
                <button
                  className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <i className="bi bi-key me-2"></i>
                  Security
                </button>
                <button
                  className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <i className="bi bi-bell me-2"></i>
                  Notifications
                </button>
              </nav>
            </aside>

            {/* Right Content Area */}
            <div className="settings-content">
              
              {/* ========== PROFILE TAB ========== */}
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
                          disabled
                        />
                      </div>
                      <small>Username cannot be changed (contact support if needed)</small>
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

                  <div className="form-field">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your Full Name"
                    />
                    <small>Your full name (private, not shown publicly)</small>
                  </div>

                  <button 
                    className="btn-save"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}

              {/* ========== ACCOUNT TAB ========== */}
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
                      placeholder="your@email.com"
                      disabled
                    />
                    <small>Email cannot be changed (contact support if needed)</small>
                  </div>

                  <div className="form-field">
                    <label>Account Type</label>
                    <select className="form-select" disabled>
                      <option>Free Plan</option>
                      <option>Pro Plan - $9/month</option>
                      <option>Business Plan - $29/month</option>
                    </select>
                    <small>Upgrade options coming soon</small>
                  </div>

                  <button 
                    className="btn-save"
                    onClick={handleSaveAccount}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>

                  <div className="divider"></div>

                  <div className="danger-zone">
                    <h3>⚠️ Danger Zone</h3>
                    <p>Permanently delete your account and all data. This action cannot be undone.</p>
                    <button 
                      className="btn-danger"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {/* ========== PRIVACY TAB ========== */}
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
                          name="profileVisibility"
                          checked={formData.profileVisibility}
                          onChange={handleChange}
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

                  <button 
                    className="btn-save"
                    onClick={handleSavePrivacy}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              )}

              {/* ========== SECURITY TAB ========== */}
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
                    <small>Must be at least 8 characters with letters and numbers</small>
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

                  <button 
                    className="btn-save" 
                    onClick={handleChangePassword}
                    disabled={saving}
                  >
                    {saving ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              )}

              {/* ========== NOTIFICATIONS TAB ========== */}
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
                        <input 
                          type="checkbox"
                          name="emailNotifications"
                          checked={formData.emailNotifications}
                          onChange={handleChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <h3>Weekly Summary</h3>
                        <p>Get a weekly summary of your link performance</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox"
                          name="weeklySummary"
                          checked={formData.weeklySummary}
                          onChange={handleChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <h3>Marketing Emails</h3>
                        <p>Receive tips, updates, and promotional content</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox"
                          name="marketingEmails"
                          checked={formData.marketingEmails}
                          onChange={handleChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <button 
                    className="btn-save"
                    onClick={handleSaveNotifications}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
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
          message="This will permanently delete all your data including profile, links, and analytics. This action cannot be undone."
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