import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { profileAPI } from '../api/profile';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/publicMenu.css';

function PublicMenu() {
  const { username, linkId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [menuLink, setMenuLink] = useState(null);
  const [profile, setProfile] = useState(null);
  const [customization, setCustomization] = useState({
    menuDisplayStyle: 'list',
    backgroundColor: '#ffffff',
    backgroundImage: '',
    backgroundType: 'color',
    buttonColor: '#667eea',
    font: 'Inter, sans-serif',
    textColor: '#2d3748'
  });

  useEffect(() => {
    fetchMenuData();
  }, [username, linkId]);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getPublicProfile(username);

      if (response.success) {
        const profileData = response.data.profile;
        const links = response.data.links || [];

        // Find the specific menu link
        const menu = links.find(link => link.id === linkId && link.type === 'menu');
        
        if (!menu) {
          console.log('Menu not found, redirecting...', { linkId, links });
          navigate(`/${username}`);
          return;
        }

        setMenuLink(menu);
        setProfile({
          displayName: profileData.title,
          avatar: profileData.profile_image_url,
          bio: profileData.bio
        });

        // Load customization
        if (profileData.customization) {
          const custom = profileData.customization;
          setCustomization({
            menuDisplayStyle: custom.menu?.displayStyle || 'list',
            backgroundColor: custom.background?.color || '#ffffff',
            backgroundImage: custom.background?.image || '',
            backgroundType: custom.background?.type || 'color',
            backgroundGradient: custom.background?.gradient || {
              colorStart: '#667eea',
              colorEnd: '#764ba2',
              direction: 'to bottom right'
            },
            buttonColor: custom.buttons?.color || '#667eea',
            font: custom.typography?.fontFamily || 'Inter, sans-serif',
            textColor: custom.typography?.textColor || '#2d3748'
          });
        }
      }
    } catch (error) {
      console.error('Fetch menu error:', error);
      navigate(`/${username}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="public-menu-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (!menuLink) {
    return null;
  }

  const menuItems = menuLink.menu_items || [];

  return (
    <div 
      className="public-menu-page"
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
      <div className="menu-container">
        {/* Header */}
        <div className="menu-header">
          <button 
            className="btn-back"
            onClick={() => navigate(`/${username}`)}
            style={{ color: customization.buttonColor }}
          >
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
          
          <div className="menu-profile">
            {profile.avatar && (
              <img 
                src={profile.avatar} 
                alt={profile.displayName}
                className="menu-avatar"
              />
            )}
            <h1 style={{ color: customization.textColor }}>{menuLink.title}</h1>
            {menuLink.description && (
              <p className="menu-description" style={{ color: customization.textColor }}>
                {menuLink.description}
              </p>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className={`menu-items-container menu-style-${customization.menuDisplayStyle}`}>
          {menuItems.length === 0 ? (
            <div className="empty-menu">
              <i className="bi bi-card-list"></i>
              <p>No menu items available</p>
            </div>
          ) : (
            menuItems.map((item, index) => (
              <div key={index} className="menu-item-card">
                {item.image && customization.menuDisplayStyle !== 'list' && (
                  <div className="menu-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                )}
                
                <div className="menu-item-content">
                  {item.image && customization.menuDisplayStyle === 'list' && (
                    <div className="menu-item-image-small">
                      <img src={item.image} alt={item.name} />
                    </div>
                  )}
                  
                  <div className="menu-item-info">
                    <div className="menu-item-header-row">
                      <h3 className="menu-item-name" style={{ color: customization.textColor }}>
                        {item.name}
                      </h3>
                      <span 
                        className="menu-item-price"
                        style={{ 
                          color: customization.buttonColor,
                          fontWeight: '700'
                        }}
                      >
                        {item.price} {item.currency}
                      </span>
                    </div>
                    
                    {item.description && (
                      <p className="menu-item-description" style={{ color: customization.textColor }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="menu-footer">
          <p style={{ color: customization.textColor }}>
            Powered by <strong>Lynqio</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PublicMenu;
