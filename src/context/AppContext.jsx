import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('home');

  const switchToGallery = () => {
    setCurrentSection('gallery');
  };

  const switchToHome = () => {
    setCurrentSection('home');
  };

  const switchToFavorites = () => {
    setCurrentSection('favorites');
  };

  const switchToPanorama = () => {
    setCurrentSection('panorama');
  };

  const switchToStory = () => {
    setCurrentSection('story');
  };

  const value = {
    currentSection,
    setCurrentSection,
    switchToGallery,
    switchToHome,
    switchToFavorites,
    switchToPanorama,
    switchToStory
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
