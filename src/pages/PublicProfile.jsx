import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { profileAPI } from '../api/profile';
import { linksAPI } from '../api/links';
import '../styles/PublicProfile.css';

function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [customization, setCustomization] = useState({
    profile: {
      displayName: '',
      avatar: '',
      headerImage: '',
      avatarShape: 'circle',
      socialLinks: {}
    },
    theme: {
      preset: 'light'
    },
    background: {
      type: 'color',
      color: '#ffffff',
      image: '',
      gradient: {
        colorStart: '#667eea',
        colorEnd: '#764ba2',
        direction: 'to bottom right'
      }
    },
    buttons: {
      color: '#667eea',
      style: 'rounded',
      shadow: true,
      border: 0,
      hoverEffect: 'lift',
      linkDisplayType: 'button',
      cardShadow: true,
      cardHoverEffect: 'lift',
      cardBorderRadius: 12
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      textColor: '#2d3748'
    }
  });

  useEffect(() => {
    fetchPublicProfile();
  }, [username]);

  const fetchPublicProfile = async () => {
    try {
      setLoading(true);
      setNotFound(false);
      
      // Fetch public profile
      const response = await profileAPI.getPublicProfile(username);
      
      if (response.success) {
        const profile = response.data.profile;
        const links = response.data.links || [];
        
        setProfileData({
          displayName: profile.title || `@${profile.username}`,
          bio: profile.bio || '',
          avatar: profile.profile_image_url || profile.user_avatar || `https://ui-avatars.com/api/?name=${profile.title.replace(' ', '+')}&background=667eea&color=fff&size=150`,
          username: profile.username || profile.slug,
          links: links
        });

        // ✅ Parse customization iz baze (umesto theme)
        if (profile.customization) {
          setCustomization(profile.customization);
        }
        // Fallback na stari theme format
        else if (profile.theme) {
          try {
            const parsedTheme = JSON.parse(profile.theme);
            setCustomization({
              profile: {
                displayName: parsedTheme.displayName || profile.title,
                avatar: parsedTheme.avatar || profile.profile_image_url,
                headerImage: '',
                avatarShape: 'circle',
                socialLinks: {}
              },
              background: {
                type: parsedTheme.backgroundType || 'color',
                color: parsedTheme.backgroundColor || '#ffffff',
                image: parsedTheme.backgroundImage || '',
                gradient: {
                  colorStart: '#667eea',
                  colorEnd: '#764ba2',
                  direction: 'to bottom right'
                }
              },
              buttons: {
                color: parsedTheme.buttonColor || '#667eea',
                style: parsedTheme.buttonStyle || 'rounded',
                shadow: true,
                border: 0,
                hoverEffect: 'lift',
                linkDisplayType: parsedTheme.linkDisplayType || 'button',
                cardShadow: true,
                cardHoverEffect: 'lift',
                cardBorderRadius: 12
              },
              typography: {
                fontFamily: parsedTheme.font || 'Inter, sans-serif',
                textColor: parsedTheme.textColor || '#2d3748'
              }
            });
          } catch (e) {
            console.log('Using default theme');
          }
        }
      }
    } catch (error) {
      console.error('Fetch public profile error:', error);
      
      if (error.response?.status === 404) {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = async (linkId) => {
    try {
      // Track click
      await linksAPI.trackClick(linkId);
    } catch (error) {
      console.error('Track click error:', error);
    }
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/${username}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      alert('Profile link copied to clipboard!');
    } else {
      alert(`Share this link: ${profileUrl}`);
    }
  };

  const handleMenuClick = (linkId) => {
    navigate(`/${username}/menu/${linkId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="public-profile-container" style={{ background: '#f7fafc' }}>
        <div className="public-profile-content">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ color: '#718096' }}>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound || !profileData) {
    return (
      <div className="public-profile-container" style={{ background: '#f7fafc' }}>
        <div className="public-profile-content">
          <div className="text-center py-5">
            <i className="bi bi-exclamation-circle" style={{ fontSize: '4rem', color: '#cbd5e0' }}></i>
            <h2 style={{ color: '#2d3748', marginTop: '1rem' }}>Profile Not Found</h2>
            <p style={{ color: '#718096' }}>
              The profile <strong>@{username}</strong> doesn't exist.
            </p>
            <a href="/" className="btn btn-primary mt-3">
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Active links only
  const activeLinks = profileData.links.filter(link => link.is_active !== false);

  return (
    <div 
      className="public-profile-container"
      style={{
        backgroundColor: customization.background.type === 'color' 
          ? customization.background.color 
          : 'transparent',
        backgroundImage: customization.background.type === 'image' && customization.background.image
          ? `url(${customization.background.image})`
          : customization.background.type === 'gradient'
          ? `linear-gradient(${customization.background.gradient.direction}, ${customization.background.gradient.colorStart}, ${customization.background.gradient.colorEnd})`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: customization.typography.fontFamily,
        color: customization.typography.textColor
      }}
    >
      <div className="public-profile-content">
        {/* Share Button 
        <button className="btn-share-profile" onClick={handleShareProfile}>
          <i className="bi bi-share"></i>
          <span>Share</span>
        </button> */}

        {/* Profile Header */}
        <div className="public-profile-header">
          {/* Header Image */}
          {customization.profile?.headerImage && (
            <div className="public-header-image">
              <img 
                src={customization.profile.headerImage} 
                alt="Header" 
                className="header-img"
              />
            </div>
          )}
          
          <img 
            src={profileData.avatar} 
            alt={profileData.displayName}
            className={`public-avatar ${customization.profile?.avatarShape || 'circle'}`}
          />
          <h1 
            className="public-name"
            style={{ color: customization.typography.textColor }}
          >
            {profileData.displayName}
          </h1>
          {profileData.bio && (
            <p 
              className="public-bio"
              style={{ color: customization.typography.textColor }}
            >
              {profileData.bio}
            </p>
          )}
          
          {/* Social Links Icons */}
          {customization.profile?.socialLinks && Object.entries(customization.profile.socialLinks).some(([_, url]) => url) && (
            <div className="public-social-links">
              {customization.profile.socialLinks.instagram && (
                <a 
                  href={`https://instagram.com/${customization.profile.socialLinks.instagram.replace('@', '')}`}
                  className="public-social-icon instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-instagram"></i>
                </a>
              )}
              {customization.profile.socialLinks.twitter && (
                <a 
                  href={`https://twitter.com/${customization.profile.socialLinks.twitter.replace('@', '')}`}
                  className="public-social-icon twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-twitter-x"></i>
                </a>
              )}
              {customization.profile.socialLinks.tiktok && (
                <a 
                  href={`https://tiktok.com/@${customization.profile.socialLinks.tiktok.replace('@', '')}`}
                  className="public-social-icon tiktok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-tiktok"></i>
                </a>
              )}
              {customization.profile.socialLinks.youtube && (
                <a 
                  href={`https://youtube.com/@${customization.profile.socialLinks.youtube.replace('@', '')}`}
                  className="public-social-icon youtube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-youtube"></i>
                </a>
              )}
              {customization.profile.socialLinks.linkedin && (
                <a 
                  href={`https://linkedin.com/in/${customization.profile.socialLinks.linkedin.replace('@', '')}`}
                  className="public-social-icon linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
              )}
              {customization.profile.socialLinks.facebook && (
                <a 
                  href={`https://facebook.com/${customization.profile.socialLinks.facebook.replace('@', '')}`}
                  className="public-social-icon facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-facebook"></i>
                </a>
              )}
              {customization.profile.socialLinks.github && (
                <a 
                  href={`https://github.com/${customization.profile.socialLinks.github.replace('@', '')}`}
                  className="public-social-icon github"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-github"></i>
                </a>
              )}
              {customization.profile.socialLinks.spotify && (
                <a 
                  href={`https://open.spotify.com/user/${customization.profile.socialLinks.spotify.replace('@', '')}`}
                  className="public-social-icon spotify"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-spotify"></i>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="public-links-container">
          {activeLinks.length > 0 ? (
            activeLinks.map((link) => {
              // Check if it's a menu type
              const isMenu = link.type === 'menu';
              
              // Determine display type: use link-specific if set, otherwise use global
              const globalDisplayType = customization.buttons?.linkDisplayType || 'button';
              const displayType = link.display_type && link.display_type !== 'default' 
                ? link.display_type 
                : globalDisplayType;

              return (
                <div key={link.id} className="public-link-wrapper">
                  {/* Card View */}
                  {displayType === 'card' && !isMenu ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`public-link-card card-hover-${customization.buttons.cardHoverEffect || 'lift'} ${customization.buttons.cardShadow ? 'with-shadow' : ''}`}
                      onClick={() => handleLinkClick(link.id)}
                      style={{
                        backgroundImage: link.card_background 
                          ? `url(${link.card_background})` 
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: `${customization.buttons.cardBorderRadius || 12}px`
                      }}
                    >
                      <div className="card-overlay"></div>
                      <div className="card-content">
                        {link.icon && link.icon !== 'bi-ban' && <i className={`bi ${link.icon} card-icon`}></i>}
                        <h3 className="card-title">{link.title}</h3>
                        {link.description && (
                          <p className="card-description">{link.description}</p>
                        )}
                      </div>
                    </a>
                  ) : isMenu ? (
                    // MENU BUTTON - Navigate to menu page
                    <button
                      type="button"
                      className={`public-link-btn btn-shape-${customization.buttons.style} hover-${customization.buttons.hoverEffect} ${customization.buttons.shadow ? 'with-shadow' : ''}`}
                      onClick={() => handleMenuClick(link.id)}
                      style={{
                        backgroundColor: customization.buttons.color,
                        border: customization.buttons.border > 0 
                          ? `${customization.buttons.border}px solid rgba(0, 0, 0, 0.2)` 
                          : 'none'
                      }}
                    >
                      {link.icon && link.icon !== 'bi-ban' && <i className={`bi ${link.icon}`}></i>}
                      <span>{link.title}</span>
                      <i className="bi bi-arrow-right menu-arrow"></i>
                    </button>
                  ) : (
                    // LINK BUTTON
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`public-link-btn btn-shape-${customization.buttons.style} hover-${customization.buttons.hoverEffect} ${customization.buttons.shadow ? 'with-shadow' : ''}`}
                      onClick={() => handleLinkClick(link.id)}
                      style={{
                        backgroundColor: customization.buttons.color,
                        border: customization.buttons.border > 0 
                          ? `${customization.buttons.border}px solid rgba(0, 0, 0, 0.2)` 
                          : 'none'
                      }}
                    >
                      {link.icon && link.icon !== 'bi-ban' && <i className={`bi ${link.icon}`}></i>}
                      <span>{link.title}</span>
                    </a>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-links-message">
              <i className="bi bi-link-45deg"></i>
              <p>No links available yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="public-footer">
          <p style={{ color: customization.typography.textColor, opacity: 0.6 }}>
            Create your own link in bio with{' '}
            <a href="/" className="footer-brand">
              <strong>Lynqio</strong>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PublicProfile;