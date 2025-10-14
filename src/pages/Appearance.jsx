import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Appearance.css';

function Appearance() {
  const { profileData, setProfileData } = useProfile();
  
  const [localProfile, setLocalProfile] = useState({
    displayName: profileData.displayName,
    bio: profileData.bio,
    avatar: profileData.avatar
  });

  const [localCustomization, setLocalCustomization] = useState({
    ...profileData.customization
  });

  const [previewDevice, setPreviewDevice] = useState('mobile');

  // Font options
  const fonts = [
    { name: 'Inter', value: 'inter' },
    { name: 'Roboto', value: 'roboto' },
    { name: 'Poppins', value: 'poppins' },
    { name: 'Montserrat', value: 'montserrat' },
    { name: 'Open Sans', value: 'open-sans' },
    { name: 'Lato', value: 'lato' }
  ];

  // Theme presets
  const themes = [
    {
      name: 'Light',
      icon: 'bi-sun',
      backgroundColor: '#ffffff',
      buttonColor: '#667eea',
      textColor: '#2d3748'
    },
    {
      name: 'Dark',
      icon: 'bi-moon-stars',
      backgroundColor: '#1a202c',
      buttonColor: '#667eea',
      textColor: '#ffffff'
    },
    {
      name: 'Ocean',
      icon: 'bi-water',
      backgroundColor: '#0ea5e9',
      buttonColor: '#0284c7',
      textColor: '#ffffff'
    },
    {
      name: 'Sunset',
      icon: 'bi-sunset',
      backgroundColor: '#f97316',
      buttonColor: '#ea580c',
      textColor: '#ffffff'
    },
    {
      name: 'Forest',
      icon: 'bi-tree',
      backgroundColor: '#059669',
      buttonColor: '#047857',
      textColor: '#ffffff'
    },
    {
      name: 'Neon',
      icon: 'bi-lightning',
      backgroundColor: '#1a1a2e',
      buttonColor: '#ff006e',
      textColor: '#00ff88'
    }
  ];

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfile({
          ...localProfile,
          avatar: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle background image upload
  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalCustomization({
          ...localCustomization,
          backgroundImage: reader.result,
          backgroundType: 'image'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply theme preset
  const applyTheme = (theme) => {
    setLocalCustomization({
      ...localCustomization,
      backgroundColor: theme.backgroundColor,
      buttonColor: theme.buttonColor,
      textColor: theme.textColor,
      backgroundType: 'color',
      backgroundImage: ''
    });
  };

  // Save all changes
  const handleSaveChanges = () => {
    setProfileData({
      ...profileData,
      displayName: localProfile.displayName,
      bio: localProfile.bio,
      avatar: localProfile.avatar,
      customization: localCustomization
    });
    alert('✅ Changes saved successfully!');
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        
        <main className="appearance-main">
          <div className="appearance-container">
            
            {/* Settings Panel */}
            <div className="appearance-settings-panel">
              <div className="appearance-header">
                <h1>Appearance</h1>
                <p>Customize how your profile looks</p>
              </div>

              {/* Profile Section */}
              <div className="settings-section">
                <h3>
                  <i className="bi bi-person-circle"></i>
                  Profile
                </h3>
                
                {/* Avatar Upload */}
                <div className="setting-group">
                  <label>Profile Image</label>
                  <div className="avatar-upload-container">
                    <img 
                      src={localProfile.avatar} 
                      alt="Profile" 
                      className="avatar-preview"
                    />
                    <div className="avatar-upload-actions">
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="avatar-upload" className="btn-upload-avatar">
                        <i className="bi bi-camera me-2 ms-0"></i>
                        Change Photo
                      </label>
                      <button 
                        className="btn-remove-avatar"
                        onClick={() => setLocalProfile({
                          ...localProfile,
                          avatar: `https://ui-avatars.com/api/?name=${localProfile.displayName.replace(' ', '+')}&background=667eea&color=fff&size=150`
                        })}
                      >
                        <i className="bi bi-trash"></i>
                        Remove Photo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Display Name */}
                <div className="setting-group">
                  <label>Display Name</label>
                  <input 
                    type="text"
                    className="setting-input"
                    value={localProfile.displayName}
                    onChange={(e) => setLocalProfile({
                      ...localProfile,
                      displayName: e.target.value
                    })}
                    placeholder="Your Name"
                  />
                </div>

                {/* Bio */}
                <div className="setting-group">
                  <label>Bio</label>
                  <textarea 
                    className="setting-textarea"
                    value={localProfile.bio}
                    onChange={(e) => setLocalProfile({
                      ...localProfile,
                      bio: e.target.value
                    })}
                    placeholder="Tell people about yourself..."
                    rows="3"
                  />
                  <small>{localProfile.bio.length}/150 characters</small>
                </div>
              </div>

              {/* Themes Section */}
              <div className="settings-section">
                <h3>
                  <i className="bi bi-palette"></i>
                  Themes
                </h3>
                <p className="section-description">Quick preset themes</p>
                
                <div className="themes-grid">
                  {themes.map((theme, index) => (
                    <button
                      key={index}
                      className="theme-card"
                      onClick={() => applyTheme(theme)}
                      style={{ backgroundColor: theme.backgroundColor }}
                    >
                      <i className={`bi ${theme.icon}`} style={{ color: theme.textColor }}></i>
                      <span style={{ color: theme.textColor }}>{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Section */}
              <div className="settings-section">
                <h3>
                  <i className="bi bi-image"></i>
                  Background
                </h3>

                {/* Background Type */}
                <div className="setting-group">
                  <label>Background Type</label>
                  <div className="toggle-buttons">
                    <button
                      className={`toggle-btn ${localCustomization.backgroundType === 'color' ? 'active' : ''}`}
                      onClick={() => setLocalCustomization({
                        ...localCustomization,
                        backgroundType: 'color'
                      })}
                    >
                      <i className="bi bi-palette"></i>
                      Color
                    </button>
                    <button
                      className={`toggle-btn ${localCustomization.backgroundType === 'image' ? 'active' : ''}`}
                      onClick={() => setLocalCustomization({
                        ...localCustomization,
                        backgroundType: 'image'
                      })}
                    >
                      <i className="bi bi-image"></i>
                      Image
                    </button>
                  </div>
                </div>

                {/* Background Color */}
                {localCustomization.backgroundType === 'color' && (
                  <div className="setting-group">
                    <label>Background Color</label>
                    <div className="color-picker-container">
                      <input 
                        type="color"
                        className="color-picker"
                        value={localCustomization.backgroundColor}
                        onChange={(e) => setLocalCustomization({
                          ...localCustomization,
                          backgroundColor: e.target.value
                        })}
                      />
                      <span className="color-value">{localCustomization.backgroundColor}</span>
                    </div>
                  </div>
                )}

                {/* Background Image */}
                {localCustomization.backgroundType === 'image' && (
                  <div className="setting-group">
                    <label>Background Image</label>
                    {!localCustomization.backgroundImage ? (
                      <div className="image-upload-box">
                        <input
                          type="file"
                          id="bg-upload"
                          accept="image/*"
                          onChange={handleBackgroundImageUpload}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="bg-upload" className="upload-box-label">
                          <i className="bi bi-cloud-upload"></i>
                          <span>Click to upload background</span>
                          <small>PNG, JPG up to 5MB</small>
                        </label>
                      </div>
                    ) : (
                      <div className="bg-image-preview">
                        <img src={localCustomization.backgroundImage} alt="Background" />
                        <button 
                          className="btn-remove-bg"
                          onClick={() => setLocalCustomization({
                            ...localCustomization,
                            backgroundImage: ''
                          })}
                        >
                          <i className="bi bi-trash"></i>
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Buttons Section */}
              <div className="settings-section">
                <h3>
                  <i className="bi bi-cursor"></i>
                  Buttons
                </h3>

                {/* Button Color */}
                <div className="setting-group">
                  <label>Button Color</label>
                  <div className="color-picker-container">
                    <input 
                      type="color"
                      className="color-picker"
                      value={localCustomization.buttonColor}
                      onChange={(e) => setLocalCustomization({
                        ...localCustomization,
                        buttonColor: e.target.value
                      })}
                    />
                    <span className="color-value">{localCustomization.buttonColor}</span>
                  </div>
                </div>

                {/* Button Style */}
                <div className="setting-group">
                  <label>Button Style</label>
                  <div className="button-style-options">
                    <button
                      className={`style-option rounded ${localCustomization.buttonStyle === 'rounded' ? 'active' : ''}`}
                      onClick={() => setLocalCustomization({
                        ...localCustomization,
                        buttonStyle: 'rounded'
                      })}
                    >
                      Rounded
                    </button>
                    <button
                      className={`style-option square ${localCustomization.buttonStyle === 'square' ? 'active' : ''}`}
                      onClick={() => setLocalCustomization({
                        ...localCustomization,
                        buttonStyle: 'square'
                      })}
                    >
                      Square
                    </button>
                    <button
                      className={`style-option pill ${localCustomization.buttonStyle === 'pill' ? 'active' : ''}`}
                      onClick={() => setLocalCustomization({
                        ...localCustomization,
                        buttonStyle: 'pill'
                      })}
                    >
                      Pill
                    </button>
                  </div>
                </div>
              </div>

              {/* Typography Section */}
              <div className="settings-section">
                <h3>
                  <i className="bi bi-fonts"></i>
                  Typography
                </h3>

                {/* Font Family */}
                <div className="setting-group">
                  <label>Font Family</label>
                  <select 
                    className="setting-select"
                    value={localCustomization.font}
                    onChange={(e) => setLocalCustomization({
                      ...localCustomization,
                      font: e.target.value
                    })}
                  >
                    {fonts.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Text Color */}
                <div className="setting-group">
                  <label>Text Color</label>
                  <div className="color-picker-container">
                    <input 
                      type="color"
                      className="color-picker"
                      value={localCustomization.textColor || '#2d3748'}
                      onChange={(e) => setLocalCustomization({
                        ...localCustomization,
                        textColor: e.target.value
                      })}
                    />
                    <span className="color-value">{localCustomization.textColor || '#2d3748'}</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button className="btn-save-appearance" onClick={handleSaveChanges}>
                <i className="bi bi-check-lg"></i>
                Save All Changes
              </button>
            </div>

            {/* Preview Panel */}
            <div className="appearance-preview-panel">
              <div className="preview-header">
                <h3>Live Preview</h3>
                <div className="preview-device-selector">
                  <button
                    className={`device-btn ${previewDevice === 'mobile' ? 'active' : ''}`}
                    onClick={() => setPreviewDevice('mobile')}
                  >
                    <i className="bi bi-phone"></i>
                  </button>
                  <button
                    className={`device-btn ${previewDevice === 'desktop' ? 'active' : ''}`}
                    onClick={() => setPreviewDevice('desktop')}
                  >
                    <i className="bi bi-display"></i>
                  </button>
                </div>
              </div>

              <div className={`preview-wrapper preview-${previewDevice}`}>
                <div 
                  className="preview-screen"
                  style={{
                    backgroundColor: localCustomization.backgroundType === 'color' 
                      ? localCustomization.backgroundColor 
                      : 'transparent',
                    backgroundImage: localCustomization.backgroundType === 'image' && localCustomization.backgroundImage
                      ? `url(${localCustomization.backgroundImage})`
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: localCustomization.textColor || '#2d3748',
                    fontFamily: localCustomization.font
                  }}
                >
                  {/* Profile */}
                  <div className="preview-profile-section">
                    <img 
                      src={localProfile.avatar}
                      alt="Profile"
                      className="preview-avatar-img"
                    />
                    <h2 style={{ color: localCustomization.textColor }}>{localProfile.displayName}</h2>
                    <p style={{ color: localCustomization.textColor, opacity: 0.8 }}>{localProfile.bio}</p>
                  </div>

                  {/* Sample Links */}
                  <div className="preview-links-section">
                    {['My Portfolio', 'Instagram', 'YouTube'].map((link, index) => (
                      <div
                        key={index}
                        className={`preview-link-item ${localCustomization.buttonStyle}`}
                        style={{
                          backgroundColor: localCustomization.buttonColor,
                          borderRadius: localCustomization.buttonStyle === 'pill' ? '50px' :
                                       localCustomization.buttonStyle === 'square' ? '8px' : '12px'
                        }}
                      >
                        <i className="bi bi-link-45deg"></i>
                        <span>{link}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="preview-footer-section">
                    <p style={{ color: localCustomization.textColor, opacity: 0.6 }}>
                      Powered by <strong>Lynqio</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Appearance;