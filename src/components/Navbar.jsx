import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Navbar.css';

function Navbar() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: null,
    username: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Učitaj iz localStorage
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        const user = JSON.parse(userFromStorage);
        const name = user.full_name || user.username || 'User'
        
        setUserData({
          name: name,
          email: user.email || '',
          avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=667eea&color=fff&size=150`,
          username: user.username || ''
        });
      }
    } catch (error) {
      console.error('Load user data error:', error);
    }
  };

  const handleUserAvatar = () => {
    if(userData?.id && userData.avatar_url){
      return userData.avatar_url;
    }

    //return `https://ui-avatars.com/api/?name=${userData.full_name.replace(' ', '+')}&background=667eea&color=fff&size=150`
    return `https://ui-avatars.com/api/?name=${userData.full_name.replace(' ', '+')}&background=667eea&color=fff&size=150`
  }

  return (
    <nav className="dashboard-navbar">
      <button 
        className="hamburger-menu"
        onClick={() => {
          const sidebar = document.querySelector('.sidebar');
          sidebar?.classList.toggle('open');
        }}
      >
        <i className="bi bi-list"></i>
      </button>
      <div className="navbar-brand">
        <div className="logo-icon-small">
          <svg width="35" height="35" viewBox="0 0 60 60" fill="none">
            <path d="M30 10L50 20V40L30 50L10 40V20L30 10Z" stroke="#667eea" strokeWidth="3"/>
            <circle cx="30" cy="30" r="8" fill="#667eea"/>
          </svg>
        </div>
        <h2>Lynqio</h2>
      </div>

      {/*<div className="navbar-center">
        <div className="search-bar">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Search links..." />
        </div>
      </div> */}

      <div className="navbar-actions">
        <button className="btn-icon" title="Notifications">
          <i className="bi bi-bell"></i>
          <span className="notification-badge">3</span>
        </button>
        
        <div className="user-profile-dropdown">
          <img 
            src={userData.avatar} 
            alt="User" 
            className="user-avatar"
          />
          <span className="user-name">{userData?.name}</span>
          {/*<i className="bi bi-chevron-down"></i>*/}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;