import React from 'react';
import OnScrollShapeMorph from './OnScrollShapeMorph';
import GalleryNavbar from './GalleryNavbar';
import './OnScrollShapeMorphPage.css';

const OnScrollShapeMorphPage = ({ onBackToHome }) => {
  return (
    <div className="onscroll-shape-morph-page">
      {/* OnScrollShapeMorph 导航栏 */}
      <GalleryNavbar onBackToHome={onBackToHome} />

      {/* 全屏 OnScrollShapeMorph 内容 */}
      <div className="onscroll-shape-morph-content">
        <OnScrollShapeMorph />
      </div>
    </div>
  );
};

export default OnScrollShapeMorphPage;
