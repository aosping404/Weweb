import { useRef, useEffect } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Panorama = () => {
  const { isMobile } = useDeviceDetection();
  const { ref: containerRef, isIntersecting: isInView } = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: '0px'
  });
  const iframeRef = useRef(null);

  useEffect(() => {
    // 移除了自动滚动功能，避免影响用户体验

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

    // 移除了从下往上滑动跳转功能，避免自动滑动

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

  return (
    <div 
      ref={containerRef}
      id="panorama" 
      className={`${isMobile ? 'h-[70vh]' : 'h-[80vh]'} w-screen bg-white text-black relative page-container`}
      style={{
        position: 'relative',
        zIndex: 1
      }}
    >

      {/* 全景展示区域 */}
      <div 
        ref={iframeRef}
        className={`relative w-full ${isMobile ? 'h-[70vh] pt-12' : 'h-[80vh] pt-16'}`}
        style={{ 
          pointerEvents: 'auto',
          touchAction: 'auto'
        }}
      >
        {/* 暂时注释掉全景图iframe，使用白色背景方便布局 */}
        {/* <iframe
          src={isMobile ? "/panorama/mobile.html" : "/panorama/"}
          style={{
            width: '90%',
            height: '100%',
            border: 'none',
            overflow: 'hidden',
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 1,
            touchAction: isMobile ? 'none' : 'auto',
            left: '5%',
            borderRadius: '20px'
          }}
          title="360度全景体验"
          allowFullScreen
          allow="accelerometer; gyroscope; camera; microphone; display-capture"
          sandbox="allow-scripts allow-forms allow-popups allow-presentation allow-orientation-lock allow-pointer-lock"
          loading="eager"
          referrerPolicy="same-origin"
        /> */}
      </div>

    </div>
  );
};

export default Panorama;
