import React, { useState, useRef } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const CleanPage = () => {
  const { isMobile } = useDeviceDetection();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      // 进入全屏
      if (containerRef.current) {
        try {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        } catch (err) {
          console.error('无法进入全屏模式:', err);
        }
      }
    } else {
      // 退出全屏
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('无法退出全屏模式:', err);
      }
    }
  };

  // 监听全屏状态变化
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      id="clean-page" 
      className={`${isFullscreen ? 'h-screen w-screen' : 'h-[60vh] w-screen'} bg-transparent text-black relative page-container`}
      style={{
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* 全屏按钮 - 中间靠下位置 */}
      <button
        onClick={toggleFullscreen}
        className="absolute left-1/2 transform -translate-x-1/2 bottom-8 z-10 bg-black text-white px-4 py-2 pixel-font text-xs hover:bg-gray-800 transition-all duration-200"
        style={{
          border: '2px solid #fff',
          boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #000, 1px 1px 0 #fff, -1px -1px 0 #000',
          imageRendering: 'pixelated',
          imageRendering: '-moz-crisp-edges',
          imageRendering: 'crisp-edges'
        }}
      >
        {isFullscreen ? 'EXIT' : 'FULLSCREEN'}
      </button>

      {/* 主要内容区域 */}
      <div 
        ref={iframeRef}
        className={`relative w-full ${isFullscreen ? 'h-screen pt-0' : 'h-[60vh] pt-12'}`}
        style={{ 
          pointerEvents: 'auto',
          touchAction: 'auto'
        }}
      >
        {/* 全景图iframe */}
        <iframe
          src={isMobile ? "/panorama/mobile.html" : "/panorama/"}
          style={{
            width: isFullscreen ? '100%' : '90%',
            height: '100%',
            border: 'none',
            overflow: 'hidden',
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 1,
            touchAction: isMobile ? 'none' : 'auto',
            left: isFullscreen ? '0%' : '5%',
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
  );
};

export default CleanPage;
