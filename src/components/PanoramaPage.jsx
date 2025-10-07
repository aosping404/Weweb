import React, { useRef, useEffect, useState } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { gsap } from 'gsap';
import BayerDitheringBackground from './BayerDitheringBackground';
import PanoramaNavbar from './PanoramaNavbar';
import './GalleryPage.css';

const PanoramaPage = ({ onBackToHome, onNavigateToGallery, onNavigateToPanorama }) => {
  const { isMobile } = useDeviceDetection();
  const { ref: containerRef, isIntersecting: isInView } = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: '0px'
  });
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // 防止页面滚动影响iframe
    const handleWheel = (e) => {
      if (isInView) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchMove = (e) => {
      if (isInView) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 添加事件监听器到iframe容器
    const iframeContainer = iframeRef.current;
    if (iframeContainer) {
      iframeContainer.addEventListener('wheel', handleWheel, { passive: false });
      iframeContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    return () => {
      if (iframeContainer) {
        iframeContainer.removeEventListener('wheel', handleWheel);
        iframeContainer.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isInView]);

  // 全屏切换功能
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // 页面进入动画
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(".panorama-page", {
      autoAlpha: 0,
      y: 50
    }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="panorama-page">
      {/* 360度全景导航栏 */}
      <PanoramaNavbar 
        onBackToHome={onBackToHome} 
        onNavigateToGallery={onNavigateToGallery}
        onNavigateToPanorama={onNavigateToPanorama}
      />

      {/* 全屏内容区域 */}
      <div className="gallery-content">
        {/* 背景 */}
        <BayerDitheringBackground style={{ zIndex: 0 }} />

        {/* 全屏切换按钮 */}
        <div className="absolute top-24 right-6 z-50">
          <button
            onClick={toggleFullscreen}
            className="bg-black/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/40 transition-all duration-300 border border-white/20"
          >
            {isFullscreen ? '退出全屏' : '全屏'}
          </button>
        </div>

        {/* 360度全景展示区域 */}
        <div 
          ref={containerRef}
          id="panorama" 
          className="w-full h-full bg-white text-black relative flex items-center justify-center"
          style={{
            position: 'relative',
            zIndex: 1,
            paddingTop: '100px', // 为导航栏和按钮留出更多空间
            paddingBottom: '20px',
            paddingLeft: '20px',
            paddingRight: '20px'
          }}
        >
          <div 
            ref={iframeRef}
            className="relative w-full h-full"
            style={{ 
              pointerEvents: 'auto',
              touchAction: 'auto',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            {/* 全景图iframe */}
            <iframe
              src={isMobile ? "/panorama/mobile.html" : "/panorama/"}
              style={{
                width: isFullscreen ? '100%' : '100%',
                height: '100%',
                border: 'none',
                overflow: 'hidden',
                pointerEvents: 'auto',
                position: 'relative',
                zIndex: 1,
                touchAction: isMobile ? 'none' : 'auto',
                borderRadius: isFullscreen ? '0px' : '20px'
              }}
              title="360度全景体验"
              allowFullScreen
              allow="accelerometer; gyroscope; camera; microphone; display-capture"
              sandbox="allow-scripts allow-forms allow-popups allow-presentation allow-orientation-lock allow-pointer-lock"
              loading="eager"
              referrerPolicy="same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanoramaPage;
