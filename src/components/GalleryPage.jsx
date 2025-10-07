import React from 'react';
import CosmicGallery from './CosmicGallery';
import GalleryNavbar from './GalleryNavbar';
import './GalleryPage.css';

const GalleryPage = ({ onBackToHome, onNavigateToGallery, onNavigateToPanorama }) => {
  return (
    <div className="gallery-page">
      {/* 相册导航栏 */}
      <GalleryNavbar 
        onBackToHome={onBackToHome} 
        onNavigateToGallery={onNavigateToGallery}
        onNavigateToPanorama={onNavigateToPanorama}
      />

      {/* 全屏相册内容 */}
      <div className="gallery-content">
        <CosmicGallery isFullscreen={true} />
      </div>
    </div>
  );
};

export default GalleryPage;
