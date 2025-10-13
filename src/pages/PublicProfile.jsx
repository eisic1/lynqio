import { useParams } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import '../styles/PublicProfile.css';

function PublicProfile() {
  const { username } = useParams();
  const { profileData } = useProfile();

  // Filter samo aktivne linkove
  const activeLinks = profileData.links.filter(link => link.active);

  return (
    <div 
      className="public-profile-container"
      style={{
        backgroundColor: profileData.customization.backgroundType === 'color' 
          ? profileData.customization.backgroundColor 
          : 'transparent',
        backgroundImage: profileData.customization.backgroundType === 'image' && profileData.customization.backgroundImage
          ? `url(${profileData.customization.backgroundImage})`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="public-profile-content">
        {/* Profile Header */}
        <div className="public-profile-header">
          <img 
            src={profileData.avatar} 
            alt={profileData.displayName}
            className="public-avatar"
          />
          <h1 className="public-name">{profileData.displayName}</h1>
          <p className="public-bio">{profileData.bio}</p>
          
          {/* Share Button */}
          <button className="btn-share-profile">
            <i className="bi bi-share"></i>
            Share Profile
          </button>
        </div>

        {/* Links Section */}
        <div className="public-links-container">
          {activeLinks.length > 0 ? (
            activeLinks.map((link) => (
             <a 
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`public-link-btn ${profileData.customization.buttonStyle}`}
                style={{
                  backgroundColor: profileData.customization.buttonColor,
                  borderRadius: profileData.customization.buttonStyle === 'pill' ? '50px' : 
                               profileData.customization.buttonStyle === 'square' ? '8px' : '12px'
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
          <p>
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