import { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/toast/ToastContainer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import { linksAPI } from '../api/links';
import { profileAPI } from '../api/profile';
import LoadingSpinner from '../components/LoadingSpinner';
import EmojiPicker from 'emoji-picker-react';
import '../styles/Editor.css';

function Editor() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('links');
  const [previewDevice, setPreviewDevice] = useState('mobile');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const titleInputRef = useRef(null);
  const [titleCursorPosition, setTitleCursorPosition] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savingAppearance, setSavingAppearance] = useState(false);

  const toast = useToast();

  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    icon: 'bi-ban',
    type: 'link', 
    menu_items: [],
    card_background: '',
    display_type: 'default'
  });

  const [customization, setCustomization] = useState({
    backgroundColor: '#ffffff',
    backgroundImage: '',
    backgroundType: 'color',
    buttonColor: '#667eea',
    buttonStyle: 'rounded',
    linkDisplayType: 'button',
    font: 'inter',
    textColor: '#2d3748',
  });

  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    avatar: 'https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg',
    avatarShape: 'circle',
    headerImage: '',
    socialLinks: {}
  });

  // Fetch linkova pri učitavanju
  useEffect(() => {
    fetchLinks();
    fetchProfileSettings();
  }, []);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showEmojiPicker && 
          !e.target.closest('.emoji-picker-container') && 
          !e.target.closest('.btn-emoji-picker')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const fetchLinks = async () => {
    setLinks([]);
    try {
      setLoading(true);
      const response = await linksAPI.getMyLinks();
      
      if (response.success) {
        setLinks(response.data.links);
      }
    } catch (error) {
      console.error('Fetch links error:', error);
      toast.showError('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
        setCustomization({
            ...customization,
            backgroundImage: reader.result,
            backgroundType: 'image'
        });
        };
        reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackgroundImage = () => {
    setCustomization({
        ...customization,
        backgroundImage: '',
        backgroundType: 'color'
    });
  };

  // Handle card background upload
  const handleCardBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.showError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLink({
          ...newLink,
          card_background: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLink = async () => {
    // Validation
    if (!newLink.title.trim()) {
      toast.showError('Please enter a title');
      return;
    }

    // Validate based on type
    if (newLink.type === 'link') {
      if (!newLink.url.trim()) {
        toast.showError('Please enter a URL');
        return;
      }
    } else if (newLink.type === 'menu') {
      if (newLink.menu_items.length === 0) {
        toast.showError('Please add at least one menu item');
        return;
      }
      
      // Validate each menu item
      for (let i = 0; i < newLink.menu_items.length; i++) {
        const item = newLink.menu_items[i];
        if (!item.name.trim()) {
          toast.showError(`Menu item #${i + 1}: Name is required`);
          return;
        }
        if (!item.price || parseFloat(item.price) <= 0) {
          toast.showError(`Menu item #${i + 1}: Valid price is required`);
          return;
        }
      }
    }

    try {
      if (newLink.id) {
        // EDIT MODE - Update postojećeg linka
        const response = await linksAPI.updateLink(newLink.id, {
          title: newLink.title,
          url: newLink.url,
          icon: newLink.icon,
          type: newLink.type,
          menu_items: newLink.menu_items,
          card_background: newLink.card_background,
          display_type: newLink.display_type
        });

        if (response.success) {
          // Ažuriraj u state
          /*setLinks(links.map(link => 
            link.id === newLink.id ? response.data.link : link
          ));*/
          fetchLinks();
          toast.showSuccess('Link updated successfully!');
        }
      } else {
        // ADD MODE - Kreiranje novog linka
        const response = await linksAPI.createLink({
          title: newLink.title,
          url: newLink.url,
          icon: newLink.icon,
          type: newLink.type,
          menu_items: newLink.menu_items,
          card_background: newLink.card_background,
          display_type: newLink.display_type
        });

        if (response.success) {
          // Dodaj u state
          //setLinks([...links, response.data.link]);
          fetchLinks();
          toast.showSuccess('Link added successfully!');
        }
      }

      // Reset form i zatvori modal
      setNewLink({ title: '', url: '', icon: 'bi-ban', type: 'link', menu_items: [], card_background: '', display_type: 'default' });
      setShowAddModal(false);

    } catch (error) {
      console.error('Add/Update link error:', error);
      const errorMessage = error.response?.data?.message || 'Operation failed';
      toast.showError(errorMessage);
    }
  };

  const onAddNewLink = () => {
    setShowAddModal(true);
    setShowEmojiPicker(false);
    setNewLink({ title: '', url: '', icon: 'bi-ban', type: 'link', menu_items: [], card_background: '', display_type: 'default' });
  };

  const handleEditingLink = (link) => {
    setShowAddModal(true);
    setShowEmojiPicker(false);
    setNewLink({ 
      id: link.id, 
      title: link.title, 
      url: link.url, 
      icon: link.icon, 
      active: link.active, 
      type: link.type, 
      menu_items: link.menu_items || [], 
      card_background: link.card_background || '',
      display_type: link.display_type || 'default'
    });
  };

  // Handle emoji selection for link title
  const handleEmojiClick = (emojiObject) => {
    const input = titleInputRef.current;
    if (input) {
      const textBefore = newLink.title.substring(0, titleCursorPosition);
      const textAfter = newLink.title.substring(titleCursorPosition);
      const newTitle = textBefore + emojiObject.emoji + textAfter;
      
      setNewLink({
        ...newLink,
        title: newTitle
      });

      // Set cursor position after emoji
      setTimeout(() => {
        const newPosition = titleCursorPosition + emojiObject.emoji.length;
        input.setSelectionRange(newPosition, newPosition);
        input.focus();
        setTitleCursorPosition(newPosition);
      }, 0);
    }
    
    setShowEmojiPicker(false);
  };

  // Track cursor position in title input
  const handleTitleChange = (e) => {
    setNewLink({ ...newLink, title: e.target.value });
    setTitleCursorPosition(e.target.selectionStart);
  };

  const handleTitleClick = (e) => {
    setTitleCursorPosition(e.target.selectionStart);
  };

  // Remove linka
  const handleDeleteLink = (id) => {
    setLinkToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await linksAPI.deleteLink(linkToDelete);

      if (response.success) {
        // Ukloni iz state
        fetchLinks();
        toast.showSuccess('🗑️ Link deleted successfully');
        setShowDeleteConfirm(false);
        setLinkToDelete(null);
      }
    } catch (error) {
      console.error('Delete link error:', error);
      toast.showError('Failed to delete link');
      setShowDeleteConfirm(false);
      setLinkToDelete(null);
    }
  };

  // Toggle activities linka
  const handleToggleLink = async (linkId, currentStatus) => {
    try {
      const response = await linksAPI.updateLink(linkId, {
        is_active: !currentStatus
      });

      if (response.success) {
        fetchLinks();
        toast.showSuccess(`Link ${!currentStatus ? 'activated' : 'deactivated'}`);
      }
    } catch (error) {
      console.error('Toggle active error:', error);
      toast.showError('Failed to update link');
    }
  };

  // Drag and Drop
  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = async (e, dropIndex) => {
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'));
    if (dragIndex === dropIndex) return; // Ista pozicija, ne radi ništa

    const draggedLink = links[dragIndex];
    const newLinks = [...links];
    newLinks.splice(dragIndex, 1);
    newLinks.splice(dropIndex, 0, draggedLink);
    setLinks(newLinks);

    await syncLinkOrder(newLinks);
  };

  const syncLinkOrder = async (reorderedLinks) => {
    try {
      // Kreiraj array sa {id, position} objektima
      const linkPositions = reorderedLinks.map((link, index) => ({
        id: link.id,
        position: index + 1  // Position počinje od 1
      }));

      const response = await linksAPI.reorderLinks(linkPositions);

      if (response.success) {
        toast.showSuccess('Order updated!');
      }
    } catch (error) {
      console.error('Reorder links error:', error);
      toast.showError('Failed to update order');
      
      // Reload linkove da vrati staro stanje
      fetchLinks();
    }
  };

  const handleSaveAppearance = async () => {
    try {
      setSavingAppearance(true);
      
      const response = await profileAPI.updateProfile({
        theme: JSON.stringify(customization)
      });

      if (response.success) {
        toast.showSuccess('✨ Appearance saved successfully!');
      }
    } catch (error) {
      console.error('Save appearance error:', error);
      toast.showError('Failed to save appearance');
    } finally {
      setSavingAppearance(false);
    }
  };

  // Handle menu item image upload
  const handleMenuItemImageUpload = async (e, itemIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.showError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.showError('Image size must be less than 5MB');
      return;
    }

    try {
      // Convert to base64 (ista metoda kao avatar/header)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const updatedItems = [...newLink.menu_items];
        updatedItems[itemIndex].image = base64String;
        setNewLink({ ...newLink, menu_items: updatedItems });
        toast.showSuccess('Image uploaded successfully!');
      };
      reader.onerror = () => {
        toast.showError('Failed to upload image');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.showError('Failed to upload image');
    }
  };

  const getSocialUrl = (platform, username) => {
    if (!username) return '';
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

  const fetchProfileSettings = async () => {
    try {
      const response = await profileAPI.getMyProfile();
      
      if (response.success) {
        const profile = response.data.profile;
        
        // Load profile data
        setProfile({
          displayName: profile.title || '',
          bio: profile.bio || '',
          avatar: profile.profile_image_url || 'https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg',
          avatarShape: 'circle',
          headerImage: '',
          socialLinks: {}
        });
        
        // Učitaj customization iz nove strukture
        if (profile.customization) {
          const custom = profile.customization;
          
          // Load profile customization
          if (custom.profile) {
            setProfile(prev => ({
              ...prev,
              displayName: custom.profile.displayName || profile.title || '',
              avatar: custom.profile.avatar || profile.profile_image_url || prev.avatar,
              avatarShape: custom.profile.avatarShape || 'circle',
              headerImage: custom.profile.headerImage || '',
              socialLinks: custom.profile.socialLinks || {}
            }));
          }
          
          setCustomization({
            backgroundColor: custom.background?.color || '#ffffff',
            backgroundImage: custom.background?.image || '',
            backgroundType: custom.background?.type || 'color',
            backgroundGradient: custom.background?.gradient || {
              enabled: false,
              colorStart: '#667eea',
              colorEnd: '#764ba2',
              direction: ''
            },
            buttonColor: custom.buttons?.color || '#667eea',
            buttonStyle: custom.buttons?.style || 'rounded',
            linkDisplayType: custom.buttons?.linkDisplayType || 'button',
            buttonShadow: custom.buttons?.shadow !== undefined ? custom.buttons.shadow : true,
            buttonBorder: custom.buttons?.border || 0,
            buttonHoverEffect: custom.buttons?.hoverEffect || 'lift',
            cardShadow: custom.buttons?.cardShadow !== undefined ? custom.buttons.cardShadow : true,
            cardHoverEffect: custom.buttons?.cardHoverEffect || 'lift',
            cardBorderRadius: custom.buttons?.cardBorderRadius || 12,
            font: custom.typography?.fontFamily || 'inter',
            textColor: custom.typography?.textColor || '#2d3748',
          });
        }
        // Fallback na stari theme format
        else if (profile.theme) {
          try {
            const savedCustomization = JSON.parse(profile.theme);
            setCustomization(savedCustomization);
          } catch (e) {
            console.log('Theme is not JSON, using defaults');
          }
        }
      }
    } catch (error) {
      console.error('Fetch profile settings error:', error);
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        
        <main className="editor-main">
          <div className="editor-container">
            
            {/* Leva strana - Editor Panel */}
            <div className="editor-panel">
              <div className="editor-header">
                <h1>Link Editor</h1>
                <p>Customize your bio link page</p>
              </div>

              {/* Tab Navigation */}
              <div className="editor-tabs">
                <button className={`tab-btn ${activeTab === 'links' ? 'active' : ''}`}
                    onClick={() => setActiveTab('links')}>
                  <i className="bi bi-link-45deg"></i>
                  Links
                </button>
                <button className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('appearance')}>
                  <i className="bi bi-palette"></i>
                  Appearance
                </button>
                <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}>
                  <i className="bi bi-gear"></i>
                  Settings
                </button>
              </div>

              {/* TAB CONTENT - Links */}
                {activeTab === 'links' && (
                <>
                    {/* Add Link Button */}
                    <button 
                    className="btn-add-link"
                    onClick={onAddNewLink}
                    >
                    <i className="bi bi-plus-lg"></i>
                    Add New Link
                    </button>

                    {/* Links List - Draggable */}
                    <div className="editor-links-list">
                    {links.map((link, index) => (
                        <div
                        key={link.id}
                        className="editor-link-item"
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        >
                        <div className="drag-handle">
                            <i className="bi bi-grip-vertical"></i>
                        </div>
                        
                        <div className="link-icon-preview">
                            <i className={`bi ${link.icon}`}></i>
                        </div>
                        
                        <div className="link-details">
                            <div className="link-title-row">
                              <h4>{link.title}</h4>
                              {/* Type Badge - DODAJ OVO */}
                              <span className={`link-type-badge ${link.type || 'link'}`}>
                                {link.type === 'menu' ? (
                                  <>
                                    <i className="bi bi-list-ul"></i>
                                    Menu
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-link-45deg"></i>
                                    Link
                                  </>
                                )}
                              </span>
                            </div>
                            {/* Show URL for links, item count for menus */}
                            {link.type === 'menu' ? (
                              <span className="link-menu-count">
                                <i className="bi bi-card-list"></i>
                                {link.menu_items?.length || 0} items
                              </span>
                            ) : (
                              <span>{link.url}</span>
                            )}
                        </div>

                        <div className="link-item-actions">
                            <label className="switch-small">
                            <input 
                                type="checkbox" 
                                checked={link.is_active}
                                onChange={() => handleToggleLink(link.id, link.is_active)}
                            />
                            <span className="slider-small"></span>
                            </label>
                            
                            <button 
                            className="btn-icon-small"
                            onClick={() => handleEditingLink(link)}
                            >
                            <i className="bi bi-pencil"></i>
                            </button>
                            
                            <button 
                            className="btn-icon-small btn-delete-small"
                            onClick={() => handleDeleteLink(link.id)}
                            >
                            <i className="bi bi-trash"></i>
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>
                </>
                )}

                {/* TAB CONTENT - Appearance */}
                {activeTab === 'appearance' && (
                <div className="tab-content-appearance">
                    <h3>Appearance Settings</h3>
                    
                    {/* Background Type Selector */}
                    <div className="custom-option">
                    <label>Background Type</label>
                    <div className="background-type-selector">
                        <button
                        className={`type-btn ${customization.backgroundType === 'color' ? 'active' : ''}`}
                        onClick={() => setCustomization({
                            ...customization,
                            backgroundType: 'color'
                        })}
                        >
                        <i className="bi bi-palette"></i>
                        Color
                        </button>
                        <button
                        className={`type-btn ${customization.backgroundType === 'image' ? 'active' : ''}`}
                        onClick={() => setCustomization({
                            ...customization,
                            backgroundType: 'image'
                        })}
                        >
                        <i className="bi bi-image"></i>
                        Image
                        </button>
                    </div>
                    </div>

                    {/* Background Color */}
                    {customization.backgroundType === 'color' && (
                    <div className="custom-option">
                        <label>Background Color</label>
                        <input 
                        type="color" 
                        value={customization.backgroundColor}
                        onChange={(e) => setCustomization({
                            ...customization,
                            backgroundColor: e.target.value
                        })}
                        />
                    </div>
                    )}

                    {/* Background Image */}
                    {customization.backgroundType === 'image' && (
                    <div className="custom-option">
                        <label>Background Image</label>
                        {!customization.backgroundImage ? (
                        <div className="image-upload-area">
                            <input
                            type="file"
                            id="bg-image-upload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            />
                            <label htmlFor="bg-image-upload" className="upload-label">
                            <i className="bi bi-cloud-upload"></i>
                            <span>Click to upload image</span>
                            <small>PNG, JPG up to 5MB</small>
                            </label>
                        </div>
                        ) : (
                        <div className="image-preview-container">
                            <img 
                            src={customization.backgroundImage} 
                            alt="Background" 
                            className="background-preview-img"
                            />
                            <button 
                            className="btn-remove-image"
                            onClick={handleRemoveBackgroundImage}
                            >
                            <i className="bi bi-trash"></i>
                            Remove Image
                            </button>
                        </div>
                        )}
                    </div>
                    )}

                    {/* Button Color */}
                    <div className="custom-option">
                    <label>Button Color</label>
                    <input 
                        type="color" 
                        value={customization.buttonColor}
                        onChange={(e) => setCustomization({
                        ...customization,
                        buttonColor: e.target.value
                        })}
                    />
                    </div>

                    {/* Button Style */}
                    <div className="custom-option">
                    <label>Button Style</label>
                    <select 
                        value={customization.buttonStyle}
                        onChange={(e) => setCustomization({
                        ...customization,
                        buttonStyle: e.target.value
                        })}
                    >
                        <option value="rounded">Rounded</option>
                        <option value="square">Square</option>
                        <option value="pill">Pill</option>
                    </select>
                    </div>
                </div>
                )}

                {/* TAB CONTENT - Settings */}
                {activeTab === 'settings' && (
                <div className="tab-content-settings">
                    <h3>Settings</h3>
                    <p style={{ color: '#718096', textAlign: 'center', marginTop: '2rem' }}>
                    Settings options coming soon...
                    </p>
                </div>
                )}

                {/* Save Button - Prikaži na svim tabovima */}
                {activeTab === 'appearance' && (
                  <button className="btn-save-changes" onClick={handleSaveAppearance}>
                  <i className="bi bi-check-lg"></i>
                  Save Changes
                  </button>
                )}
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
                        backgroundColor: customization.backgroundType === 'color' 
                            ? customization.backgroundColor 
                            : 'transparent',
                        backgroundImage: customization.backgroundType === 'image' && customization.backgroundImage
                            ? `url(${customization.backgroundImage})`
                            : customization.backgroundType === 'gradient'
                            ? `linear-gradient(${customization.backgroundGradient.direction}, ${customization.backgroundGradient.colorStart}, ${customization.backgroundGradient.colorEnd})`
                            : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        fontFamily: customization.font,
                        color: customization.textColor
                    }}
                    >
                    
                    {/* Header Image */}
                    {profile.headerImage && (
                      <div className="preview-header-image">
                        <img 
                          src={profile.headerImage} 
                          alt="Header" 
                          className="header-img"
                        />
                      </div>
                    )}

                    {/* Profile Section */}
                    <div className="preview-profile">
                        <img 
                          src={profile.avatar} 
                          alt="Profile"
                          className={`preview-avatar ${profile.avatarShape}`}
                        />
                        <h2 style={{ color: customization.textColor }}>{profile.displayName || 'Your Name'}</h2>
                        <p style={{ color: customization.textColor }}>{profile.bio || 'Your bio here'}</p>

                        {/* Social Links Icons */}
                        {Object.entries(profile.socialLinks || {}).some(([_, url]) => url) && (
                          <div className="preview-social-links">
                            {profile.socialLinks.instagram && (
                              <a 
                                href={getSocialUrl('instagram', profile.socialLinks.instagram)} 
                                className="preview-social-icon instagram"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-instagram"></i>
                              </a>
                            )}
                            {profile.socialLinks.twitter && (
                              <a 
                                href={getSocialUrl('twitter', profile.socialLinks.twitter)} 
                                className="preview-social-icon twitter"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-twitter-x"></i>
                              </a>
                            )}
                            {profile.socialLinks.tiktok && (
                              <a 
                                href={getSocialUrl('tiktok', profile.socialLinks.tiktok)} 
                                className="preview-social-icon tiktok"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-tiktok"></i>
                              </a>
                            )}
                            {profile.socialLinks.youtube && (
                              <a 
                                href={getSocialUrl('youtube', profile.socialLinks.youtube)} 
                                className="preview-social-icon youtube"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-youtube"></i>
                              </a>
                            )}
                            {profile.socialLinks.linkedin && (
                              <a 
                                href={getSocialUrl('linkedin', profile.socialLinks.linkedin)} 
                                className="preview-social-icon linkedin"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-linkedin"></i>
                              </a>
                            )}
                            {profile.socialLinks.facebook && (
                              <a 
                                href={getSocialUrl('facebook', profile.socialLinks.facebook)} 
                                className="preview-social-icon facebook"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-facebook"></i>
                              </a>
                            )}
                            {profile.socialLinks.github && (
                              <a 
                                href={getSocialUrl('github', profile.socialLinks.github)} 
                                className="preview-social-icon github"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-github"></i>
                              </a>
                            )}
                            {profile.socialLinks.spotify && (
                              <a 
                                href={getSocialUrl('spotify', profile.socialLinks.spotify)} 
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
                        {links.filter(link => link.is_active).map((link) => {
                          // Determine display type: use link-specific if set, otherwise use global
                          const displayType = link.display_type && link.display_type !== 'default' 
                            ? link.display_type 
                            : customization.linkDisplayType;
                          
                          return displayType === 'button' ? (
                            // Button View
                            <a
                              key={link.id}
                              href={link.url}
                              className={`preview-link-btn btn-shape-${customization.buttonStyle} hover-${customization.buttonHoverEffect} ${customization.buttonShadow ? 'with-shadow' : ''}`}
                              style={{ 
                                backgroundColor: customization.buttonColor,
                                border: customization.buttonBorder > 0 
                                  ? `${customization.buttonBorder}px solid rgba(0, 0, 0, 0.2)` 
                                  : 'none'
                              }}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className={`bi ${link.icon}`}></i>
                              <span>{link.title}</span>
                            </a>
                          ) : (
                            // Card View
                            <a
                              key={link.id}
                              href={link.url}
                              className={`preview-link-card card-hover-${customization.cardHoverEffect} ${customization.cardShadow ? 'with-shadow' : ''}`}
                              style={{ 
                                backgroundImage: link.card_background 
                                  ? `url(${link.card_background})` 
                                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: `${customization.cardBorderRadius}px`
                              }}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <div className="card-overlay"></div>
                              <div className="card-content">
                                <i className={`bi ${link.icon} card-icon`}></i>
                                <h3 className="card-title">{link.title}</h3>
                                {link.description && (
                                  <p className="card-description">{link.description}</p>
                                )}
                              </div>
                            </a>
                          );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="preview-footer">
                        <p style={{ color: customization.textColor }}>Powered by <strong>Lynqio</strong></p>
                    </div>
                    </div>
                </div>
            </div>
            </div>
        </main>
      </div>

      {/* Add Link Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}
            style={{
                background: 'white',
                borderRadius: "20px"
            }}>
            <div className="modal-header">
              <h3>
                {newLink.id ? 'Edit Link' : 'Add New Link'}
            </h3>
              <button 
                className="btn-close-modal"
                onClick={() => setShowAddModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body">
              {/* Live Preview Section - Added */}
              {newLink.type === 'link' && newLink.title && (
                <div className="link-preview-section">
                  <label>
                    <i className="bi bi-eye"></i>
                    Live Preview
                  </label>
                  <div 
                    className="link-preview-container"
                    style={{
                      backgroundColor: customization.backgroundType === 'color' 
                        ? customization.backgroundColor 
                        : 'transparent',
                      backgroundImage: customization.backgroundType === 'image' && customization.backgroundImage
                        ? `url(${customization.backgroundImage})`
                        : customization.backgroundType === 'gradient'
                        ? `linear-gradient(${customization.backgroundGradient.direction}, ${customization.backgroundGradient.colorStart}, ${customization.backgroundGradient.colorEnd})`
                        : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      fontFamily: customization.font,
                      color: customization.textColor
                    }}
                  >
                    {(() => {
                      // Determine display type for preview
                      const displayType = newLink.display_type && newLink.display_type !== 'default' 
                        ? newLink.display_type 
                        : customization.linkDisplayType;
                      
                      return displayType === 'button' ? (
                        // Button Preview
                        <a
                          className={`preview-link-btn btn-shape-${customization.buttonStyle} hover-${customization.buttonHoverEffect} ${customization.buttonShadow ? 'with-shadow' : ''}`}
                          style={{ 
                            backgroundColor: customization.buttonColor,
                            border: customization.buttonBorder > 0 
                              ? `${customization.buttonBorder}px solid rgba(0, 0, 0, 0.2)` 
                              : 'none',
                            pointerEvents: 'none'
                          }}
                        >
                          {newLink.icon && newLink.icon !== 'bi-ban' && <i className={`bi ${newLink.icon}`}></i>}
                          <span>{newLink.title}</span>
                        </a>
                      ) : (
                        // Card Preview
                        <a
                          className={`preview-link-card card-hover-${customization.cardHoverEffect} ${customization.cardShadow ? 'with-shadow' : ''}`}
                          style={{ 
                            backgroundImage: newLink.card_background 
                              ? `url(${newLink.card_background})` 
                              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: `${customization.cardBorderRadius}px`,
                            pointerEvents: 'none'
                          }}
                        >
                          <div className="card-overlay"></div>
                          <div className="card-content">
                            {newLink.icon && newLink.icon !== 'bi-ban' && <i className={`bi ${newLink.icon} card-icon`}></i>}
                            <h3 className="card-title">{newLink.title}</h3>
                          </div>
                        </a>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Type Selector - DODAJ OVO */}
              <div className="form-group">
                <label>Content Type</label>
                <div className="type-selector">
                  <button
                    type="button"
                    className={`type-option ${newLink.type === 'link' ? 'active' : ''}`}
                    onClick={() => setNewLink({
                      ...newLink,
                      type: 'link',
                      menu_items: []
                    })}
                  >
                    <i className="bi bi-link-45deg"></i>
                    <span>Link</span>
                  </button>
                  <button
                    type="button"
                    className={`type-option ${newLink.type === 'menu' ? 'active' : ''}`}
                    onClick={() => setNewLink({
                      ...newLink,
                      type: 'menu',
                      url: ''
                    })}
                  >
                    <i className="bi bi-list-ul"></i>
                    <span>Menu</span>
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Link Title</label>
                <div className="input-with-emoji">
                  <input 
                    ref={titleInputRef}
                    type="text"
                    placeholder="e.g. My Portfolio"
                    value={newLink.title}
                    onChange={handleTitleChange}
                    onClick={handleTitleClick}
                    onKeyUp={handleTitleClick}
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
              </div>

              {/* URL - SAMO ZA LINK TYPE */}
              {newLink.type === 'link' && (
                <>
                <div className="form-group">
                  <label>URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://example.com"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  />
                </div>

                {/* Display Type Selector */}
                <div className="form-group">
                  <label>Display As</label>
                  <small className="form-hint">Choose how this link should appear (or use global setting)</small>
                  <div className="type-selector display-type-selector">
                    <button
                      type="button"
                      className={`type-option ${newLink.display_type === 'default' ? 'active' : ''}`}
                      onClick={() => setNewLink({
                        ...newLink,
                        display_type: 'default'
                      })}
                    >
                      <i className="bi bi-gear"></i>
                      <span>Global Setting</span>
                    </button>
                    <button
                      type="button"
                      className={`type-option ${newLink.display_type === 'button' ? 'active' : ''}`}
                      onClick={() => setNewLink({
                        ...newLink,
                        display_type: 'button'
                      })}
                    >
                      <i className="bi bi-square"></i>
                      <span>Button</span>
                    </button>
                    <button
                      type="button"
                      className={`type-option ${newLink.display_type === 'card' ? 'active' : ''}`}
                      onClick={() => setNewLink({
                        ...newLink,
                        display_type: 'card'
                      })}
                    >
                      <i className="bi bi-credit-card"></i>
                      <span>Card</span>
                    </button>
                  </div>
                </div>
                </>
              )}

              <div className="form-group">
                <label>Icon (Bootstrap Icon class)</label>
                <div className="icon-selector">
                  {['bi-ban','bi-link-45deg', 'bi-telephone', 'bi-envelope', 'bi-instagram', 'bi-youtube', 'bi-twitter', 
                    'bi-facebook', 'bi-linkedin', 'bi-github', 'bi-globe', 'bi-geo-alt'].map(icon => (
                    <button
                      key={icon}
                      className={`icon-option ${newLink.icon === icon ? 'selected' : ''}`}
                      onClick={() => {
                        if (icon === 'bi-ban') setNewLink({...newLink, icon: ''}); 
                        else setNewLink({...newLink, icon})
                      }}
                    >
                      <i className={`bi ${icon}`}></i>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Background Image Upload - SAMO ZA LINK TYPE */}
              {newLink.type === 'link' && (newLink.display_type === 'card' || (newLink.display_type === 'default' && customization.linkDisplayType === 'card')) && (
                <div className="form-group">
                  <label>
                    <i className="bi bi-image"></i>
                    Card Background Image (Optional)
                  </label>
                  <small className="form-hint">Upload a custom background for this card</small>
                  
                  {!newLink.card_background ? (
                    <div className="card-bg-upload-box">
                      <input
                        type="file"
                        id="card-bg-upload"
                        accept="image/*"
                        onChange={handleCardBackgroundUpload}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="card-bg-upload" className="upload-box-label">
                        <i className="bi bi-cloud-upload"></i>
                        <span>Click to upload background</span>
                        <small>PNG, JPG up to 5MB</small>
                      </label>
                    </div>
                  ) : (
                    <div className="card-bg-preview">
                      <img src={newLink.card_background} alt="Card Background" />
                      <button 
                        type="button"
                        className="btn-remove-card-bg"
                        onClick={() => setNewLink({ ...newLink, card_background: '' })}
                      >
                        <i className="bi bi-trash"></i>
                        Remove Background
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Menu Items Section - SAMO ZA MENU TYPE */}
            {newLink.type === 'menu' && (
              <div className="form-group menu-items-section">
                <label>
                  <i className="bi bi-card-list"></i>
                  Menu Items
                </label>
                
                {/* Menu Items List */}
                {newLink.menu_items.length > 0 ? (
                  <div className="menu-items-list">
                    {newLink.menu_items.map((item, index) => (
                      <div key={index} className="menu-item-card">
                        <div className="menu-item-header">
                          <span className="menu-item-number">#{index + 1}</span>
                          <button
                            type="button"
                            className="btn-remove-item"
                            onClick={() => {
                              const updatedItems = newLink.menu_items.filter((_, i) => i !== index);
                              setNewLink({ ...newLink, menu_items: updatedItems });
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        
                        <div className="menu-item-fields">
                          {/* Item Name */}
                          <div className="form-group-inline">
                            <label>Item Name</label>
                            <input
                              type="text"
                              className="form-input-sm"
                              placeholder="e.g., Espresso"
                              value={item.name}
                              onChange={(e) => {
                                const updatedItems = [...newLink.menu_items];
                                updatedItems[index].name = e.target.value;
                                setNewLink({ ...newLink, menu_items: updatedItems });
                              }}
                            />
                          </div>
                          
                          {/* Price & Currency */}
                          <div className="form-group-inline price-group">
                            <label>Price</label>
                            <div className="price-input-group">
                              <input
                                type="number"
                                step="0.01"
                                className="form-input-sm price-input"
                                placeholder="2.00"
                                value={item.price}
                                onChange={(e) => {
                                  const updatedItems = [...newLink.menu_items];
                                  updatedItems[index].price = e.target.value;
                                  setNewLink({ ...newLink, menu_items: updatedItems });
                                }}
                              />
                              <select
                                className="currency-select"
                                value={item.currency}
                                onChange={(e) => {
                                  const updatedItems = [...newLink.menu_items];
                                  updatedItems[index].currency = e.target.value;
                                  setNewLink({ ...newLink, menu_items: updatedItems });
                                }}
                              >
                                <option value="€">€</option>
                                <option value="$">$</option>
                                <option value="£">£</option>
                                <option value="KM">KM</option>
                              </select>
                            </div>
                          </div>
                          
                          {/* Description (optional) */}
                          <div className="form-group-inline">
                            <label>Description (optional)</label>
                            <input
                              type="text"
                              className="form-input-sm"
                              placeholder="e.g., Strong Italian coffee"
                              value={item.description || ''}
                              onChange={(e) => {
                                const updatedItems = [...newLink.menu_items];
                                updatedItems[index].description = e.target.value;
                                setNewLink({ ...newLink, menu_items: updatedItems });
                              }}
                            />
                          </div>
                          
                          {/* Image Upload */}
                          <div className="form-group-inline">
                            <label>Image (optional)</label>
                            <div className="image-upload-container">
                              {item.image ? (
                                <div className="uploaded-image-preview">
                                  <img src={item.image} alt={item.name} />
                                  <button
                                    type="button"
                                    className="btn-remove-image"
                                    onClick={() => {
                                      const updatedItems = [...newLink.menu_items];
                                      updatedItems[index].image = '';
                                      setNewLink({ ...newLink, menu_items: updatedItems });
                                    }}
                                  >
                                    <i className="bi bi-x"></i>
                                  </button>
                                </div>
                              ) : (
                                <label className="btn-upload-image">
                                  <i className="bi bi-image"></i>
                                  <span>Upload Image</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => handleMenuItemImageUpload(e, index)}
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-menu-state">
                    <i className="bi bi-card-list"></i>
                    <p>No menu items yet. Add your first item!</p>
                  </div>
                )}
                
                {/* Add Menu Item Button */}
                <button
                  type="button"
                  className="btn-add-menu-item"
                  onClick={() => {
                    setNewLink({
                      ...newLink,
                      menu_items: [
                        ...newLink.menu_items,
                        {
                          id: Date.now().toString(),
                          name: '',
                          price: '',
                          currency: '€',
                          description: '',
                          image: ''
                        }
                      ]
                    });
                  }}
                >
                  <i className="bi bi-plus-circle"></i>
                  Add Menu Item
                </button>
              </div>
            )}

            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleAddLink}
              >
                {newLink.id ? 'Update Link' : 'Add Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Link?"
          message="Are you sure you want to delete this link? This action cannot be undone."
          onConfirm={() => {
            confirmDelete(linkToDelete);
          }}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setLinkToDelete(null);
          }}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
}

export default Editor;