import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Editor.css';

function Editor() {
  const [links, setLinks] = useState([
    {
      id: 1,
      title: 'My Portfolio',
      url: 'https://johndoe.com',
      icon: 'bi-briefcase',
      active: true
    },
    {
      id: 2,
      title: 'Instagram',
      url: 'https://instagram.com/johndoe',
      icon: 'bi-instagram',
      active: true
    },
    {
      id: 3,
      title: 'YouTube Channel',
      url: 'https://youtube.com/@johndoe',
      icon: 'bi-youtube',
      active: true
    },
  ]);

  const [customization, setCustomization] = useState({
    backgroundColor: '#ffffff',
    backgroundImage: '',
    backgroundType: 'color',
    buttonColor: '#667eea',
    buttonStyle: 'rounded',
    font: 'inter'
  });

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

  const [activeTab, setActiveTab] = useState('links');
  const [previewDevice, setPreviewDevice] = useState('mobile');
  const [showAddModal, setShowAddModal] = useState(false);
  //const [editingLink, setEditingLink] = useState(null);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    icon: 'bi-link-45deg'
  });

  // Add new linka
  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
        if (newLink.id) {
            // EDIT MODE - Update link
            setLinks(links.map(link => 
                link.id === newLink.id 
                ? { ...newLink } 
                : link
            ));
        } else {
            // ADD MODE - Add new link
            setLinks([...links, { 
                id: Date.now(), 
                ...newLink, 
                active: true 
            }]);
        }
        
        // Reset form and close modal
        setNewLink({ title: '', url: '', icon: 'bi-link-45deg' });
        setShowAddModal(false);
    }
  };

  const handleEditingLink = (link) => {
    console.log('DANAS JE DIVAN DAN', link)
    setShowAddModal(true);
    setNewLink({ id: link.id, title: link.title, url: link.url, icon: link.icon, active: link.active });
  };

  // Remove linka
  const handleDeleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  // Toggle activities linka
  const handleToggleLink = (id) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, active: !link.active } : link
    ));
  };

  // Drag and Drop
  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'));
    const draggedLink = links[dragIndex];
    const newLinks = [...links];
    newLinks.splice(dragIndex, 1);
    newLinks.splice(dropIndex, 0, draggedLink);
    setLinks(newLinks);
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
                    onClick={() => setShowAddModal(true)}
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
                            <h4>{link.title}</h4>
                            <span>{link.url}</span>
                        </div>

                        <div className="link-item-actions">
                            <label className="switch-small">
                            <input 
                                type="checkbox" 
                                checked={link.active}
                                onChange={() => handleToggleLink(link.id)}
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
                <button className="btn-save-changes">
                <i className="bi bi-check-lg"></i>
                Save Changes
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
                        backgroundColor: customization.backgroundType === 'color' 
                            ? customization.backgroundColor 
                            : 'transparent',
                        backgroundImage: customization.backgroundType === 'image' && customization.backgroundImage
                            ? `url(${customization.backgroundImage})`
                            : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                    >
                    {/* Profile Section */}
                    <div className="preview-profile">
                        <img 
                        src="https://ui-avatars.com/api/?name=John+Doe&background=667eea&color=fff&size=100" 
                        alt="Profile"
                        className="preview-avatar"
                        />
                        <h2>John Doe</h2>
                        <p>Content Creator & Designer</p>
                    </div>

                    {/* Links Preview */}
                    <div className="preview-links">
                        {links.filter(link => link.active).map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            className={`preview-link-btn ${customization.buttonStyle}`}
                            style={{ 
                            backgroundColor: customization.buttonColor,
                            borderRadius: customization.buttonStyle === 'pill' ? '50px' : 
                                        customization.buttonStyle === 'square' ? '8px' : '12px'
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
              <div className="form-group">
                <label>Link Title</label>
                <input 
                  type="text"
                  placeholder="e.g. My Portfolio"
                  value={newLink.title}
                  onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>URL</label>
                <input 
                  type="url"
                  placeholder="https://example.com"
                  value={newLink.url}
                  onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Icon (Bootstrap Icon class)</label>
                <div className="icon-selector">
                  {['bi-link-45deg', 'bi-instagram', 'bi-youtube', 'bi-twitter', 
                    'bi-facebook', 'bi-linkedin', 'bi-github', 'bi-globe'].map(icon => (
                    <button
                      key={icon}
                      className={`icon-option ${newLink.icon === icon ? 'selected' : ''}`}
                      onClick={() => setNewLink({...newLink, icon})}
                    >
                      <i className={`bi ${icon}`}></i>
                    </button>
                  ))}
                </div>
              </div>
            </div>

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
    </div>
  );
}

export default Editor;