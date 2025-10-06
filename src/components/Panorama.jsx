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
    // 当全景页面进入视口时，自动滚动到最佳观看位置（向下25px）
    if (isInView) {
      setTimeout(() => {
        const panoramaElement = containerRef.current;
        if (panoramaElement) {
          const rect = panoramaElement.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const optimalScrollTop = window.scrollY + rect.top - (viewportHeight * 0.1);
          
          window.scrollTo({
            top: optimalScrollTop,
            behavior: 'smooth'
          });
        }
      }, 100);
    }

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

    // 处理从下往上滑动跳转到About页面
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e) => {
      if (isInView) {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }
    };

    const handleTouchEnd = (e) => {
      if (isInView) {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();
        const deltaY = touchStartY - touchEndY; // 向上滑动为正值
        const deltaTime = touchEndTime - touchStartTime;

        // 检测从下往上滑动：向上滑动超过100px且时间少于500ms
        if (deltaY > 100 && deltaTime < 500) {
          // 跳转到About页面（显示586955.jpg）
          const aboutSection = document.querySelector('#about');
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    // 添加事件监听器到iframe容器
    const iframeContainer = iframeRef.current;
    if (iframeContainer) {
      iframeContainer.addEventListener('wheel', handleWheel, { passive: false });
      iframeContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
      iframeContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
      iframeContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    return () => {
      if (iframeContainer) {
        iframeContainer.removeEventListener('wheel', handleWheel);
        iframeContainer.removeEventListener('touchmove', handleTouchMove);
        iframeContainer.removeEventListener('touchstart', handleTouchStart);
        iframeContainer.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isInView]);

  return (
    <div 
      ref={containerRef}
      id="panorama" 
      className={`min-h-screen w-screen bg-[#0a0a0f] text-white relative overflow-hidden page-container ${isMobile ? 'panorama-mobile-container' : ''}`}
      style={{
        position: 'relative',
        zIndex: 1,
        isolation: 'isolate',
        contain: 'layout style paint'
      }}
    >

      {/* 全景展示区域 */}
      <div 
        ref={iframeRef}
        className={`relative w-full ${isMobile ? 'h-screen pt-12' : 'h-screen pt-16'}`}
        style={{ 
          pointerEvents: 'auto',
          isolation: 'isolate',
          touchAction: isMobile ? 'none' : 'auto'
        }}
      >
        <iframe
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
        />
      </div>

      {/* 跳过按钮 - 只在移动端显示 */}
      {isMobile && (
        <div className="absolute left-1/2 transform -translate-x-1/2 z-50 bottom-12">
          <button 
            onClick={() => {
              // 滚动到随机标语页面
              const storySection = document.querySelector('#story');
              if (storySection) {
                storySection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="pixel-font-no-glow bg-black/50 backdrop-blur-md border border-white/20 px-6 py-3 text-white hover:bg-white/10 transition-colors duration-300 rounded-full"
          >
            SKIP
          </button>
        </div>
      )}
    </div>
  );
};

export default Panorama;
