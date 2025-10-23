import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { profileAPI } from '../api/profile';
import { linksAPI } from '../api/links';
import '../styles/PublicProfile.css';

function PublicProfile() {
  const { username } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [customization, setCustomization] = useState({
    backgroundColor: '#ffffff',
    buttonColor: '#667eea',
    textColor: '#2d3748',
    buttonStyle: 'rounded',
    font: 'inter'
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
        
        setProfileData({
          displayName: profile.title || `@${profile.username}`,
          bio: profile.bio || '',
          avatar: profile.profile_image_url || profile.user_avatar || `https://ui-avatars.com/api/?name=${profile.title.replace(' ', '+')}&background=667eea&color=fff&size=150`,
          username: profile.username || profile.slug,
          links: profile.links || []
        });

        // Parse theme ako postoji
        if (profile.theme) {
          try {
            const parsedTheme = JSON.parse(profile.theme);
            setCustomization(parsedTheme);
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
        background: customization.backgroundType === 'color' 
          ? customization.backgroundColor 
          : `url(${customization.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: customization.textColor,
        fontFamily: customization.font
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
          <img 
            src={profileData.avatar} 
            alt={profileData.displayName}
            className="public-avatar"
          />
          <h1 
            className="public-name"
            style={{ color: customization.textColor }}
          >
            {profileData.displayName}
          </h1>
          {profileData.bio && (
            <p 
              className="public-bio"
              style={{ color: customization.textColor }}
            >
              {profileData.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="public-links-container">
          {activeLinks.length > 0 ? (
            activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`public-link-btn ${customization.buttonStyle}`}
                onClick={() => handleLinkClick(link.id)}
                style={{
                  backgroundColor: customization.buttonColor,
                  borderRadius: customization.buttonStyle === 'pill' ? '50px' : 
                               customization.buttonStyle === 'square' ? '8px' : '12px'
                }}
              >
                <i className={`bi ${link.icon}`}></i>
                <span>{link.title}</span>
                <i className="bi bi-arrow-up-right link-external-icon"></i>
              </a>
            ))
          ) : (
            <div className="no-links-message">
              <i className="bi bi-link-45deg"></i>
              <p>No links available yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="public-footer">
          <p style={{ color: customization.textColor, opacity: 0.6 }}>
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