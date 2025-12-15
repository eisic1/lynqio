import { useState, useEffect, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { linksAPI } from '../api/links';
import { profileAPI } from '../api/profile';
import { useToast } from '../components/toast/ToastContainer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Appearance.css';
import EmojiPicker from 'emoji-picker-react';

function Appearance() {
  const bioTextareaRef = useRef(null);
  const { profileData, setProfileData } = useProfile();
  let [links, setLinks] = useState([]);
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [localProfile, setLocalProfile] = useState({
    displayName: '',
    bio: '',
    avatar: 'https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg',
    headerImage: '',
    avatarShape: 'circle',
    socialLinks: {
      instagram: '',
      twitter: '',
      tiktok: '',
      youtube: '',
      linkedin: '',
      facebook: '',
      github: '',
      spotify: ''
    }
  });

  const [localCustomization, setLocalCustomization] = useState({
    backgroundColor: '#ffffff',
    backgroundType: 'color',
    backgroundImage: '',
    backgroundGradient: { 
      enabled: false,
      colorStart: '#667eea',
      colorEnd: '#764ba2',
      direction: 'to bottom right'
    },
    buttonColor: '#667eea',
    buttonStyle: 'rounded',
    buttonShadow: true, 
    buttonBorder: 0, 
    buttonHoverEffect: 'lift',
    font: 'inter',
    textColor: '#2d3748'
  });

  const [previewDevice, setPreviewDevice] = useState('mobile');
  const [activeSection, setActiveSection] = useState('profile');

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



  useEffect(() => {
    fetchProfile();
    fetchLinks();

    const handleClickOutside = (e) => {
      if (showEmojiPicker && 
          !e.target.closest('.emoji-picker-container') && 
          !e.target.closest('.btn-emoji-picker')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getMyProfile();
      
      if (response.success) {
        const profile = response.data.profile;
        
        // Postavi profile podatke
        setLocalProfile({
          displayName: profile.title || '',
          bio: profile.bio || '',
          avatar: profile.profile_image_url || 'https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg',
          headerImage: '',
          socialLinks: {
            instagram: '',
            twitter: '',
            tiktok: '',
            youtube: '',
            linkedin: '',
            facebook: '',
            github: '',
            spotify: ''
          } 
        });

        // Učitaj customization iz baze
      if (profile.customization) {
        const customization = profile.customization;
        
        // Ako postoji profile sekcija u customization
        if (customization.profile) {
          setLocalProfile(prev => ({
            ...prev,
            displayName: customization.profile.displayName || profile.title || '',
            avatar: customization.profile.avatar || profile.profile_image_url || prev.avatar,
            avatarShape: customization.profile.avatarShape || 'circle',
            headerImage: customization.profile.headerImage || '',
            socialLinks: customization.profile.socialLinks || {}
          }));
        }
        
        // Učitaj background settings
        if (customization.background) {
          setLocalCustomization(prev => ({
            ...prev,
            backgroundColor: customization.background.color || '#ffffff',
            backgroundType: customization.background.type || 'color',
            backgroundImage: customization.background.image || '',
            backgroundGradient: customization.background.gradient || { 
              enabled: false,
              colorStart: '#667eea',
              colorEnd: '#764ba2',
              direction: ''
            }
          }));
        }
        
        // Učitaj button settings
        if (customization.buttons) {
          setLocalCustomization(prev => ({
            ...prev,
            buttonColor: customization.buttons.color || '#667eea',
            buttonStyle: customization.buttons.style || 'rounded',
            buttonShadow: customization.buttons.shadow !== undefined ? customization.buttons.shadow : true, 
            buttonBorder: customization.buttons.border || 0, 
            buttonHoverEffect: customization.buttons.hoverEffect || 'lift'
          }));
        }
        
        // Učitaj typography settings
        if (customization.typography) {
          setLocalCustomization(prev => ({
            ...prev,
            font: customization.typography.fontFamily || 'inter',
            textColor: customization.typography.textColor || '#2d3748'
          }));
        }
      } 

        // Učitaj theme ako postoji
        else if (profile.theme) {
          try {
            const savedTheme = JSON.parse(profile.theme);
            setLocalCustomization(savedTheme);
          } catch (e) {
            console.log('Theme is not JSON, using defaults');
          }
        }
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      toast.showError('Failed to load profile settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchLinks = async () => {
    setLinks([]);
    try {
      //setLoading(true);
      const response = await linksAPI.getMyLinks();
      
      if (response.success) {
        setLinks(response.data.links);
        links = response.data.links;
      }
    } catch (error) {
      console.error('Fetch links error:', error);
      toast.showError('Failed to load links');
    } finally {
      //setLoading(false);
    }
  };

  const getSocialUrl = (platform, username) => {
    if (!username) return '';
    
    // Ukloni spaces i @ symbol
    const cleanUsername = username.trim().replace('@', '');
    
    const baseUrls = {
      instagram: 'https://instagram.com/',
      twitter: 'https://twitter.com/',
      tiktok: 'https://tiktok.com/@',
      youtube: 'https://youtube.com/@',
      linkedin: 'https://linkedin.com/in/',
      facebook: 'https://facebook.com/',
      github: 'https://github.com/',
      spotify: 'https://open.spotify.com/user/'
    };
    
    return baseUrls[platform] + cleanUsername;
  };

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

        localProfile.avatar = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle header image upload
  const handleHeaderImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validacija veličine fajla (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image is too large. Maximum size is 5MB.');
        return;
      }
      
      // Validacija tipa fajla
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPG, PNG, GIF).');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfile({
          ...localProfile,
          headerImage: reader.result
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

  // Handle emoji selection
  const handleEmojiClick = (emojiObject) => {
    const textarea = bioTextareaRef.current;
    
    if (textarea) {
      const cursorPosition = textarea.selectionStart;
      const textBefore = localProfile.bio.substring(0, cursorPosition);
      const textAfter = localProfile.bio.substring(cursorPosition);
      const newBio = textBefore + emojiObject.emoji + textAfter;
      
      // Check length limit
      if (newBio.length <= 150) {
        setLocalProfile({
          ...localProfile,
          bio: newBio
        });
        
        // Set cursor position after emoji
        setTimeout(() => {
          const newPosition = cursorPosition + emojiObject.emoji.length;
          textarea.setSelectionRange(newPosition, newPosition);
          textarea.focus();
        }, 0);
      }
    }
  };

  // Apply theme preset
  const applyTheme = (theme) => {
    setLocalCustomization({
      ...localCustomization,
      backgroundColor: theme.backgroundColor,
      backgroundType: 'color',
      backgroundImage: '',
      buttonColor: theme.buttonColor,
      textColor: theme.textColor
    });
  };

  // Save all changes
  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      
      // Kreiraj customization objekat
      const customization = {
        profile: {
          displayName: localProfile.displayName,
          avatar: localProfile.avatar,
          avatarShape: localProfile.avatarShape,
          headerImage: localProfile.headerImage,
          socialLinks: localProfile.socialLinks
        },
        theme: {
          preset: 'custom'
        },
        background: {
          type: localCustomization.backgroundType,
          color: localCustomization.backgroundColor,
          image: localCustomization.backgroundImage,
          gradient: localCustomization.backgroundGradient
        },
        buttons: {
          color: localCustomization.buttonColor,
          style: localCustomization.buttonStyle,
          shadow: localCustomization.buttonShadow,
          border: localCustomization.buttonBorder,
          hoverEffect: localCustomization.buttonHoverEffect
        },
        typography: {
          fontFamily: localCustomization.font,
          textColor: localCustomization.textColor
        }
      };
      
      const response = await profileAPI.updateProfile({
        title: localProfile.displayName,
        bio: localProfile.bio,
        profile_image_url: localProfile.avatar,
        customization: customization 
      });

      if (response.success) {
        toast.showSuccess('✨ Appearance saved successfully!');
      }
    } catch (error) {
      console.error('Save appearance error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save changes';
      toast.showError(errorMessage);
    } finally {
      setSaving(false);
    }
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
                <h3 
                  onClick={() => setActiveSection(activeSection === 'profile' ? '' : 'profile')}
                  className="section-header-clickable"
                >
                  <div className="section-header-left">
                    <i className="bi bi-person-circle"></i>
                    Profile
                  </div>
                  <i className={`bi bi-chevron-${activeSection === 'profile' ? 'up' : 'down'} section-toggle-icon`}></i>
                </h3>
                
                <div className={`section-content ${activeSection === 'profile' ? 'active' : ''}`}>
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

                  {/* Avatar Shape - DODAJ OVO */}
                  <div className="setting-group">
                    <label>Avatar Shape</label>
                    <div className="avatar-shape-options">
                      <button
                        className={`avatar-shape-btn circle ${localProfile.avatarShape === 'circle' ? 'active' : ''}`}
                        onClick={() => setLocalProfile({
                          ...localProfile,
                          avatarShape: 'circle'
                        })}
                      >
                        <div className="shape-preview circle">
                          <img src={localProfile.avatar} alt="Circle" />
                        </div>
                        <span>Circle</span>
                      </button>
                      
                      <button
                        className={`avatar-shape-btn square ${localProfile.avatarShape === 'square' ? 'active' : ''}`}
                        onClick={() => setLocalProfile({
                          ...localProfile,
                          avatarShape: 'square'
                        })}
                      >
                        <div className="shape-preview square">
                          <img src={localProfile.avatar} alt="Square" />
                        </div>
                        <span>Square</span>
                      </button>
                      
                      <button
                        className={`avatar-shape-btn rounded ${localProfile.avatarShape === 'rounded' ? 'active' : ''}`}
                        onClick={() => setLocalProfile({
                          ...localProfile,
                          avatarShape: 'rounded'
                        })}
                      >
                        <div className="shape-preview rounded">
                          <img src={localProfile.avatar} alt="Rounded" />
                        </div>
                        <span>Rounded</span>
                      </button>
                    </div>
                  </div>

                  {/* Header Image Upload - DODAJ OVO */}
                  <div className="setting-group">
                    <label>
                      Header Image
                      <span className="label-hint">Recommended: 1500x500px</span>
                    </label>
                    <div className="header-upload-container">
                      {localProfile.headerImage ? (
                        <div className="header-preview-wrapper">
                          <img 
                            src={localProfile.headerImage} 
                            alt="Header" 
                            className="header-preview"
                          />
                          <div className="header-overlay">
                            <input
                              type="file"
                              id="header-upload"
                              accept="image/*"
                              onChange={handleHeaderImageUpload}
                              style={{ display: 'none' }}
                            />
                            <label htmlFor="header-upload" className="btn-change-header">
                              <i className="bi bi-camera"></i>
                              Change
                            </label>
                            <button 
                              className="btn-remove-header"
                              onClick={() => setLocalProfile({ ...localProfile, headerImage: '' })}
                            >
                              <i className="bi bi-trash"></i>
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="header-upload-empty">
                          <input
                            type="file"
                            id="header-upload"
                            accept="image/*"
                            onChange={handleHeaderImageUpload}
                            style={{ display: 'none' }}
                          />
                          <label htmlFor="header-upload" className="btn-upload-header">
                            <i className="bi bi-image"></i>
                            <span>Upload Header Image</span>
                            <small>JPG, PNG or GIF (max 5MB)</small>
                          </label>
                        </div>
                      )}
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
                      <div className="bio-input-wrapper">
                        <textarea 
                          ref={bioTextareaRef}
                          className="setting-textarea"
                          value={localProfile.bio}
                          onChange={(e) => {
                            if (e.target.value.length <= 150) {
                              setLocalProfile({
                                ...localProfile,
                                bio: e.target.value
                              });
                            }
                          }}
                          placeholder="Tell people about yourself..."
                          rows="3"
                        />
                        <button 
                          className="btn-emoji-picker"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          type="button"
                        >
                          <i className="bi bi-emoji-smile"></i>
                        </button>
                      </div>
                      
                      {/* Emoji Picker */}
                      {showEmojiPicker && (
                        <div className="emoji-picker-container">
                          <EmojiPicker 
                            onEmojiClick={handleEmojiClick}
                            width="100%"
                            height="350px"
                            searchPlaceholder="Search emoji..."
                            previewConfig={{ showPreview: false }}
                          />
                        </div>
                      )}
                      
                      <div className="bio-footer">
                        <small className={localProfile.bio.length >= 150 ? 'text-danger' : ''}>
                          {localProfile.bio.length}/150 characters
                        </small>
                      </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="setting-group">
                      <label>
                        <i className="bi bi-share me-2"></i>
                        Social Media Links
                      </label>
                      <small className="mb-3">Add your social media profiles</small>
                      
                      <div className="social-links-grid">
                        {/* Instagram */}
                        <div className="social-link-item">
                          <div className="social-link-icon instagram">
                            <i className="bi bi-instagram"></i>
                          </div>
                          <input
                            type="url"
                            className="social-link-input"
                            placeholder="Instagram username"
                            value={localProfile.socialLinks?.instagram || ''}
                            onChange={(e) => setLocalProfile({
                              ...localProfile,
                              socialLinks: {
                                ...localProfile.socialLinks,
                                instagram: e.target.value
                              }
                            })}
                          />
                        </div>

                        {/* Twitter */}
                        <div className="social-link-item">
                          <div className="social-link-icon twitter">
                            <i className="bi bi-twitter-x"></i>
                          </div>
                          <input
                            type="url"
                            className="social-link-input"
                            placeholder="Twitter/X username"
                            value={localProfile.socialLinks?.twitter || ''}
                            onChange={(e) => setLocalProfile({
                              ...localProfile,
                              socialLinks: {
                                ...localProfile.socialLinks,
                                twitter: e.target.value
                              }
                            })}
                          />
                        </div>

                        {/* TikTok */}
                        <div className="social-link-item">
                          <div className="social-link-icon tiktok">
                            <i className="bi bi-tiktok"></i>
                          </div>
                          <input
                            type="url"
                            className="social-link-input"
                            placeholder="TikTok username"
                            value={localProfile.socialLinks?.tiktok || ''}
                            onChange={(e) => setLocalProfile({
                              ...localProfile,
                              socialLinks: {
                                ...localProfile.socialLinks,
                                tiktok: e.target.value
                              }
                            })}
                          />
                        </div>

                        {/* YouTube */}
                        <div className="social-link-item">
                          <div className="social-link-icon youtube">
                            <i className="bi bi-youtube"></i>
                          </div>
                          <input
                            type="url"
                            className="social-link-input"
                            placeholder="YouTube channel"
                            value={localProfile.socialLinks?.youtube || ''}
                            onChange={(e) => setLocalProfile({
                              ...localProfile,
                              socialLinks: {
                                ...localProfile.socialLinks,
                                youtube: e.target.value
                              }
                            })}
                          />
                        </div>

                        {/* LinkedIn */}
                        <div className="social-link-item">
                          <div className="social-link-icon linkedin">
                            <i className="bi bi-linkedin"></i>
                          </div>
                          <input
                            type="url"
                            className="social-link-input"
                            placeholder="LinkedIn profile"
                            value={localProfile.socialLinks?.linkedin || ''}
                            onChange={(e) => setLocalProfile({
                              ...localProfile,
                              socialLinks: {
                                ...localProfile.socialLinks,
                                linkedin: e.target.value
                              }
                            })}
                          />
                        </div>

                        {/* Facebook */}
                        <div className="social-link-item">
                          <div className="social-link-icon facebook">
                            <i className="bi bi-facebook"></i>
                          </div>
                          <input
                            type="url"
                            className="social-link-input"
                            placeholder="Facebook profile"
                            value={localProfile.socialLinks?.facebook || ''}
                            onChange={(e) => setLocalProfile({
                              ...localProfile,
                              socialLinks: {
                                ...localProfile.socialLinks,
                                facebook: e.target.value
                              }
                            })}
                          />
                        </div>

                        {/* GitHub */}
                        <div className="social-link-item">
                          <div className="social-link-icon github">
                            <i className="bi bi-github"></i>
                          </div>
                          <input
                            type="url"
                            className="social-link-input"
                            placeholder="GitHub username"
                            value={localProfile.socialLinks?.github || ''}
                            onChange={(e) => setLocalProfile({
                              ...localProfile,
                              socialLinks: {
                                ...localProfile.socialLinks,
                                github: e.target.value
                              }
                            })}
                          />
                        </div>

                        {/* Spotify */}
                        <div className="social-link-item">
                          <div className="social-link-icon spotify">
                            <i className="bi bi-spotify"></i>
                          </div>
                          <input
                            type="url"
                            className="social-link-input"
                            placeholder="Spotify profile"
                            value={localProfile.socialLinks?.spotify || ''}
                            onChange={(e) => setLocalProfile({
                              ...localProfile,
                              socialLinks: {
                                ...localProfile.socialLinks,
                                spotify: e.target.value
                              }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Themes Section */}
              <div className="settings-section">
                <h3 
                  onClick={() => setActiveSection(activeSection === 'themes' ? '' : 'themes')}
                  className="section-header-clickable"
                >
                  <div className="section-header-left">
                    <i className="bi bi-palette"></i>
                    Themes
                  </div>
                  <i className={`bi bi-chevron-${activeSection === 'themes' ? 'up' : 'down'} section-toggle-icon`}></i>
                </h3>

                <div className={`section-content ${activeSection === 'themes' ? 'active' : ''}`}>
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
              </div>

              {/* Background Section */}
              <div className="settings-section">
                <h3 
                  onClick={() => setActiveSection(activeSection === 'background' ? '' : 'background')}
                  className="section-header-clickable"
                >
                  <div className="section-header-left">
                    <i className="bi bi-image"></i>
                    Background
                  </div>
                  <i className={`bi bi-chevron-${activeSection === 'background' ? 'up' : 'down'} section-toggle-icon`}></i>
                </h3>

                <div className={`section-content ${activeSection === 'background' ? 'active' : ''}`}>
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
                        className={`toggle-btn ${localCustomization.backgroundType === 'gradient' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          backgroundType: 'gradient'
                        })}
                      >
                        <i className="bi bi-brightness-alt-high"></i>
                        Gradient
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

                  {/* Background Gradient - DODAJ OVO */}
                  {localCustomization.backgroundType === 'gradient' && (
                    <div className="setting-group">
                      <label>Gradient Colors</label>
                      
                      {/* Start Color */}
                      <div className="gradient-color-row">
                        <span className="gradient-label">Start</span>
                        <div className="color-picker-container">
                          <input 
                            type="color"
                            className="color-picker"
                            value={localCustomization.backgroundGradient.colorStart}
                            onChange={(e) => setLocalCustomization({
                              ...localCustomization,
                              backgroundGradient: {
                                ...localCustomization.backgroundGradient,
                                colorStart: e.target.value
                              }
                            })}
                          />
                          <span className="color-value">{localCustomization.backgroundGradient.colorStart}</span>
                        </div>
                      </div>

                      {/* End Color */}
                      <div className="gradient-color-row">
                        <span className="gradient-label">End</span>
                        <div className="color-picker-container">
                          <input 
                            type="color"
                            className="color-picker"
                            value={localCustomization.backgroundGradient.colorEnd}
                            onChange={(e) => setLocalCustomization({
                              ...localCustomization,
                              backgroundGradient: {
                                ...localCustomization.backgroundGradient,
                                colorEnd: e.target.value
                              }
                            })}
                          />
                          <span className="color-value">{localCustomization.backgroundGradient.colorEnd}</span>
                        </div>
                      </div>

                      {/* Gradient Direction */}
                      <div className="setting-group mt-3">
                        <label>Direction</label>
                        <select
                          className="setting-select"
                          value={localCustomization.backgroundGradient.direction}
                          onChange={(e) => setLocalCustomization({
                            ...localCustomization,
                            backgroundGradient: {
                              ...localCustomization.backgroundGradient,
                              direction: e.target.value
                            }
                          })}
                        >
                          <option value="to bottom">Top to Bottom ↓</option>
                          <option value="to top">Bottom to Top ↑</option>
                          <option value="to right">Left to Right →</option>
                          <option value="to left">Right to Left ←</option>
                          <option value="to bottom right">Diagonal ↘</option>
                          <option value="to bottom left">Diagonal ↙</option>
                          <option value="to top right">Diagonal ↗</option>
                          <option value="to top left">Diagonal ↖</option>
                          <option value="circle">Radial (Center)</option>
                        </select>
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
              </div>

              {/* Buttons Section */}
              <div className="settings-section">
                <h3 
                  onClick={() => setActiveSection(activeSection === 'buttons' ? '' : 'buttons')}
                  className="section-header-clickable"
                >
                  <div className="section-header-left">
                    <i className="bi bi-cursor"></i>
                    Buttons
                  </div>
                  <i className={`bi bi-chevron-${activeSection === 'buttons' ? 'up' : 'down'} section-toggle-icon`}></i>
                </h3>

                  <div className={`section-content ${activeSection === 'buttons' ? 'active' : ''}`}>
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
                    <div className="button-style-grid">
                      <button
                        className={`style-option rounded ${localCustomization.buttonStyle === 'rounded' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonStyle: 'rounded'
                        })}
                      >
                        <div className="style-preview rounded"></div>
                        <span>Rounded</span>
                      </button>
                      
                      <button
                        className={`style-option square ${localCustomization.buttonStyle === 'square' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonStyle: 'square'
                        })}
                      >
                        <div className="style-preview square"></div>
                        <span>Square</span>
                      </button>
                      
                      <button
                        className={`style-option pill ${localCustomization.buttonStyle === 'pill' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonStyle: 'pill'
                        })}
                      >
                        <div className="style-preview pill"></div>
                        <span>Pill</span>
                      </button>
                      
                      <button
                        className={`style-option smooth ${localCustomization.buttonStyle === 'smooth' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonStyle: 'smooth'
                        })}
                      >
                        <div className="style-preview smooth"></div>
                        <span>Smooth</span>
                      </button>
                      
                      <button
                        className={`style-option hexagon ${localCustomization.buttonStyle === 'hexagon' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonStyle: 'hexagon'
                        })}
                      >
                        <div className="style-preview hexagon"></div>
                        <span>Hexagon</span>
                      </button>
                      
                      <button
                        className={`style-option skewed ${localCustomization.buttonStyle === 'skewed' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonStyle: 'skewed'
                        })}
                      >
                        <div className="style-preview skewed"></div>
                        <span>Skewed</span>
                      </button>
                      
                      <button
                        className={`style-option cut-corner ${localCustomization.buttonStyle === 'cut-corner' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonStyle: 'cut-corner'
                        })}
                      >
                        <div className="style-preview cut-corner"></div>
                        <span>Cut Corner</span>
                      </button>
                      
                      <button
                        className={`style-option chevron ${localCustomization.buttonStyle === 'chevron' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonStyle: 'chevron'
                        })}
                      >
                        <div className="style-preview chevron"></div>
                        <span>Chevron</span>
                      </button>
                    </div>
                  </div>

                  {/* Button Shadow - DODAJ OVO */}
                  <div className="setting-group">
                    <label>Button Shadow</label>
                    <div className="toggle-switch-container">
                      <button
                        className={`toggle-switch ${localCustomization.buttonShadow ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonShadow: !localCustomization.buttonShadow
                        })}
                      >
                        <div className="toggle-switch-slider"></div>
                      </button>
                      <span className="toggle-switch-label">
                        {localCustomization.buttonShadow ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  {/* Button Border - DODAJ OVO */}
                  <div className="setting-group">
                    <label>Button Border</label>
                    <div className="border-width-options">
                      <button
                        className={`border-option ${localCustomization.buttonBorder === 0 ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonBorder: 0
                        })}
                      >
                        <div className="border-preview no-border"></div>
                        <span>None</span>
                      </button>
                      <button
                        className={`border-option ${localCustomization.buttonBorder === 2 ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonBorder: 2
                        })}
                      >
                        <div className="border-preview thin-border"></div>
                        <span>Thin</span>
                      </button>
                      <button
                        className={`border-option ${localCustomization.buttonBorder === 4 ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonBorder: 4
                        })}
                      >
                        <div className="border-preview medium-border"></div>
                        <span>Medium</span>
                      </button>
                      <button
                        className={`border-option ${localCustomization.buttonBorder === 6 ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonBorder: 6
                        })}
                      >
                        <div className="border-preview thick-border"></div>
                        <span>Thick</span>
                      </button>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="setting-group">
                    <label>Hover Effect</label>
                    <div className="hover-effect-grid">
                      <button
                        className={`hover-option ${localCustomization.buttonHoverEffect === 'lift' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonHoverEffect: 'lift'
                        })}
                      >
                        <i className="bi bi-arrow-up"></i>
                        <span>Lift</span>
                      </button>
                      
                      <button
                        className={`hover-option ${localCustomization.buttonHoverEffect === 'glow' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonHoverEffect: 'glow'
                        })}
                      >
                        <i className="bi bi-brightness-high"></i>
                        <span>Glow</span>
                      </button>
                      
                      <button
                        className={`hover-option ${localCustomization.buttonHoverEffect === 'scale' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonHoverEffect: 'scale'
                        })}
                      >
                        <i className="bi bi-arrows-angle-expand"></i>
                        <span>Scale</span>
                      </button>
                      
                      <button
                        className={`hover-option ${localCustomization.buttonHoverEffect === 'bounce' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonHoverEffect: 'bounce'
                        })}
                      >
                        <i className="bi bi-arrow-down-up"></i>
                        <span>Bounce</span>
                      </button>
                      
                      <button
                        className={`hover-option ${localCustomization.buttonHoverEffect === 'pulse' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonHoverEffect: 'pulse'
                        })}
                      >
                        <i className="bi bi-circle"></i>
                        <span>Pulse</span>
                      </button>
                      
                      <button
                        className={`hover-option ${localCustomization.buttonHoverEffect === 'shake' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonHoverEffect: 'shake'
                        })}
                      >
                        <i className="bi bi-phone-vibrate"></i>
                        <span>Shake</span>
                      </button>
                      
                      <button
                        className={`hover-option ${localCustomization.buttonHoverEffect === 'swing' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonHoverEffect: 'swing'
                        })}
                      >
                        <i className="bi bi-arrow-left-right"></i>
                        <span>Swing</span>
                      </button>
                      
                      <button
                        className={`hover-option ${localCustomization.buttonHoverEffect === 'rotate' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonHoverEffect: 'rotate'
                        })}
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                        <span>Rotate</span>
                      </button>
                      
                      <button
                        className={`hover-option ${localCustomization.buttonHoverEffect === 'flip' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonHoverEffect: 'flip'
                        })}
                      >
                        <i className="bi bi-phone-flip"></i>
                        <span>Flip</span>
                      </button>
                      
                      <button
                        className={`hover-option ${localCustomization.buttonHoverEffect === 'neon' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonHoverEffect: 'neon'
                        })}
                      >
                        <i className="bi bi-lightning"></i>
                        <span>Neon</span>
                      </button>
                      
                      <button
                        className={`hover-option ${localCustomization.buttonHoverEffect === 'gradient-shift' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonHoverEffect: 'gradient-shift'
                        })}
                      >
                        <i className="bi bi-rainbow"></i>
                        <span>Gradient</span>
                      </button>
                      
                      <button
                        className={`hover-option ${localCustomization.buttonHoverEffect === 'none' ? 'active' : ''}`}
                        onClick={() => setLocalCustomization({
                          ...localCustomization,
                          buttonHoverEffect: 'none'
                        })}
                      >
                        <i className="bi bi-dash-circle"></i>
                        <span>None</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography Section */}
              <div className="settings-section">
                <h3 
                  onClick={() => setActiveSection(activeSection === 'typography' ? '' : 'typography')}
                  className="section-header-clickable"
                >
                  <div className="section-header-left">
                    <i className="bi bi-fonts"></i>
                    Typography
                  </div>
                  <i className={`bi bi-chevron-${activeSection === 'typography' ? 'up' : 'down'} section-toggle-icon`}></i>
                </h3>

                <div className={`section-content ${activeSection === 'typography' ? 'active' : ''}`}>
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
              </div>

              {/* Save Button */}
              <button className="btn-save-appearance" onClick={handleSaveChanges}>
                <i className="bi bi-check-lg"></i>
                Save All Changes
              </button>
            </div>

            {/* Right Side - Live Preview */}
            <div className="preview-panel">
                <div className="preview-header">
                    <h3>Live Preview</h3>
                    <div className="preview-actions">
                    <button 
                        className={`btn-preview-action ${previewDevice === 'mobile' ? 'active' : ''}`}
                        onClick={() => setPreviewDevice('mobile')}
                        title="Mobile"
                    >
                        <i className="bi bi-phone"></i>
                    </button>
                    <button 
                        className={`btn-preview-action ${previewDevice === 'tablet' ? 'active' : ''}`}
                        onClick={() => setPreviewDevice('tablet')}
                        title="Tablet"
                    >
                        <i className="bi bi-tablet"></i>
                    </button>
                    <button 
                        className={`btn-preview-action ${previewDevice === 'desktop' ? 'active' : ''}`}
                        onClick={() => setPreviewDevice('desktop')}
                        title="Desktop"
                    >
                        <i className="bi bi-display"></i>
                    </button>
                    </div>
                </div>

                <div className={`preview-device preview-${previewDevice}`}>
                    <div 
                      className="preview-content"
                      style={{ 
                        backgroundColor: localCustomization.backgroundType === 'color' 
                          ? localCustomization.backgroundColor 
                          : 'transparent',
                        backgroundImage: localCustomization.backgroundType === 'image' && localCustomization.backgroundImage
                          ? `url(${localCustomization.backgroundImage})`
                          : localCustomization.backgroundType === 'gradient'
                          ? `linear-gradient(${localCustomization.backgroundGradient.direction}, ${localCustomization.backgroundGradient.colorStart}, ${localCustomization.backgroundGradient.colorEnd})`
                          : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    >

                      {/* Header Image - DODAJ OVO */}
                      {localProfile.headerImage && (
                        <div className="preview-header-image">
                          <img 
                            src={localProfile.headerImage} 
                            alt="Header" 
                            className="header-img"
                          />
                        </div>
                      )}
                    {/* Profile Section */}
                    <div className="preview-profile">
                        <img 
                        src={localProfile.avatar} 
                        alt="Profile"
                        className={`preview-avatar ${localProfile.avatarShape}`}
                        />
                        <h2>{localProfile.displayName}</h2>
                        <p>{localProfile.bio}</p>

                        {/* Social Links Icons - DODAJ OVO */}
                        {Object.entries(localProfile.socialLinks || {}).some(([_, url]) => url) && (
                          <div className="preview-social-links">
                            {localProfile.socialLinks.instagram && (
                              <a 
                                href={getSocialUrl('instagram', localProfile.socialLinks.instagram)} 
                                className="preview-social-icon instagram"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-instagram"></i>
                              </a>
                            )}
                            {localProfile.socialLinks.twitter && (
                              <a 
                                href={getSocialUrl('twitter', localProfile.socialLinks.twitter)} 
                                className="preview-social-icon twitter"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-twitter-x"></i>
                              </a>
                            )}
                            {localProfile.socialLinks.tiktok && (
                              <a 
                                href={getSocialUrl('tiktok', localProfile.socialLinks.tiktok)} 
                                className="preview-social-icon tiktok"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-tiktok"></i>
                              </a>
                            )}
                            {localProfile.socialLinks.youtube && (
                              <a 
                                href={getSocialUrl('youtube', localProfile.socialLinks.youtube)} 
                                className="preview-social-icon youtube"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-youtube"></i>
                              </a>
                            )}
                            {localProfile.socialLinks.linkedin && (
                              <a 
                                href={getSocialUrl('linkedin', localProfile.socialLinks.linkedin)} 
                                className="preview-social-icon linkedin"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-linkedin"></i>
                              </a>
                            )}
                            {localProfile.socialLinks.facebook && (
                              <a 
                                href={getSocialUrl('facebook', localProfile.socialLinks.facebook)} 
                                className="preview-social-icon facebook"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-facebook"></i>
                              </a>
                            )}
                            {localProfile.socialLinks.github && (
                              <a 
                                href={getSocialUrl('github', localProfile.socialLinks.github)} 
                                className="preview-social-icon github"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-github"></i>
                              </a>
                            )}
                            {localProfile.socialLinks.spotify && (
                              <a 
                                href={getSocialUrl('spotify', localProfile.socialLinks.spotify)} 
                                className="preview-social-icon spotify"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-spotify"></i>
                              </a>
                            )}
                          </div>
                        )}
                    </div>

                    {/* Links Preview */}
                    <div className="preview-links">
                      {links.filter(link => link.is_active).map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          className={`preview-link-btn btn-shape-${localCustomization.buttonStyle} hover-${localCustomization.buttonHoverEffect} ${localCustomization.buttonShadow ? 'with-shadow' : ''}`}
                          style={{ 
                            backgroundColor: localCustomization.buttonColor,
                            border: localCustomization.buttonBorder > 0 
                              ? `${localCustomization.buttonBorder}px solid rgba(0, 0, 0, 0.2)` 
                              : 'none'
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className={`bi ${link.icon}`}></i>
                          <span>{link.title}</span>
                        </a>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="preview-footer">
                        <p>Powered by <strong>Lynqio</strong></p>
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