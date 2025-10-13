import { createContext, useState, useContext } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    username: 'johndoe',
    displayName: 'John Doe',
    bio: 'Content Creator & Designer',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=667eea&color=fff&size=150',
    links: [
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
    ],
    customization: {
      backgroundColor: '#ffffff',
      backgroundImage: '',
      backgroundType: 'color',
      buttonColor: '#667eea',
      buttonStyle: 'rounded',
      font: 'inter'
    }
  });

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};