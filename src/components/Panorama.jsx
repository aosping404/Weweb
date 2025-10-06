import { useState, useEffect, useRef } from 'react';

const Panorama = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // 检测是否为移动设备
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    checkMobile();
    
    // 监听窗口大小变化
    const handleResize = () => {
      checkMobile();
    };

    // 使用 Intersection Observer 检测全景页面是否在视口中
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.5, // 当50%的组件可见时触发
        rootMargin: '0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
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

    // 添加事件监听器到iframe容器
    const iframeContainer = iframeRef.current;
    if (iframeContainer) {
      iframeContainer.addEventListener('wheel', handleWheel, { passive: false });
      iframeContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (iframeContainer) {
        iframeContainer.removeEventListener('wheel', handleWheel);
        iframeContainer.removeEventListener('touchmove', handleTouchMove);
      }
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
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
      {/* 标题 */}
      <div className={`absolute z-50 text-right ${isMobile ? 'top-12 right-4' : 'top-28 right-8'}`}>
        <h1 className={`art-font art-heading font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`} style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
          360度全景
        </h1>
        <p className={`art-font text-white/60 mt-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`} style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
          {isMobile ? '移动端体验' : '桌面端体验'}
        </p>
      </div>

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

      {/* 操作提示 */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 z-50 ${isMobile ? 'bottom-4' : 'bottom-8'}`}>
        <div className={`bg-black/50 backdrop-blur-md rounded-full border border-white/20 ${isMobile ? 'px-4 py-2' : 'px-6 py-3'}`}>
          <p className={`art-font text-white text-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {isMobile ? '双指滑动控制全景图，单指滑动翻页' : '拖拽鼠标或使用滚轮探索全景'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Panorama;
