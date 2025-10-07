import About from "./components/About";
import Hero from "./components/Hero";
import ModernNavbar from "./components/ModernNavbar";
import GalleryPage from "./components/GalleryPage";
import PanoramaPage from "./components/PanoramaPage";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScanningProvider } from "./context/ScanningContext";
import Lenis from 'lenis';


function AppContent() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'gallery' 或 'panorama'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lenisRef = useRef(null);

  // GSAP设置和Lenis平滑滚动初始化
  useEffect(() => {
    gsap.registerPlugin(CustomEase, ScrollTrigger);
    gsap.set("body", { autoAlpha: 1 });

    // 设置默认缓动
    gsap.defaults({
      ease: "power2.inOut",
      duration: 0.7
    });

    // 初始化 Lenis 平滑滚动
    const initSmoothScrolling = () => {
      lenisRef.current = new Lenis({
        lerp: 0.1,
        smoothWheel: true
      });

      lenisRef.current.on('scroll', () => ScrollTrigger.update());

      const scrollFn = (time) => {
        lenisRef.current.raf(time);
        requestAnimationFrame(scrollFn);
      };

      requestAnimationFrame(scrollFn);
    };

    initSmoothScrolling();

    // 清理函数
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  // 页面切换时更新 ScrollTrigger
  useEffect(() => {
    if (lenisRef.current) {
      ScrollTrigger.refresh();
    }
  }, [currentPage]);

  // 导航到相册页面
  const navigateToGallery = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // 退出当前页面动画
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentPage('gallery');
        setIsTransitioning(false);
      }
    });

    // 根据当前页面选择退出动画的目标元素
    let exitTarget;
    if (currentPage === 'home') {
      exitTarget = ".content-mobile";
    } else if (currentPage === 'panorama') {
      exitTarget = ".panorama-page";
    }
    
    if (exitTarget) {
      tl.to(exitTarget, {
        autoAlpha: 0,
        y: -50,
        duration: 0.6,
        ease: "power2.in"
      });
    } else {
      tl.set({}, { duration: 0.1 });
    }
  };


  // 导航到 360度全景 页面
  const navigateToPanorama = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // 退出当前页面动画
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentPage('panorama');
        setIsTransitioning(false);
      }
    });

    // 根据当前页面选择退出动画的目标元素
    let exitTarget;
    if (currentPage === 'home') {
      exitTarget = ".content-mobile";
    } else if (currentPage === 'gallery') {
      exitTarget = ".gallery-page";
    }
    
    if (exitTarget) {
      tl.to(exitTarget, {
        autoAlpha: 0,
        y: -50,
        duration: 0.6,
        ease: "power2.in"
      });
    } else {
      tl.set({}, { duration: 0.1 });
    }
  };

  // 返回首页
  const backToHome = (targetSection = null) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // 退出相册或作品集页面动画
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentPage('home');
        setIsTransitioning(false);

        // 如果有指定目标区域，延迟滚动到该位置
        if (targetSection) {
          setTimeout(() => {
            const element = document.querySelector(targetSection);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100); // 等待页面切换动画完成后
        }
      }
    });

    // 根据当前页面选择退出动画的目标元素
    let exitTarget;
    if (currentPage === 'gallery') {
      exitTarget = ".gallery-page";
    } else if (currentPage === 'panorama') {
      exitTarget = ".panorama-page";
    }
    
    if (exitTarget) {
      tl.to(exitTarget, {
        autoAlpha: 0,
        y: 50,
        duration: 0.6,
        ease: "power2.in"
      });
    }
  };

  // 页面进入动画
  useEffect(() => {
    if (currentPage === 'home') {
      // 首页进入动画
      gsap.fromTo(".content-mobile", {
        autoAlpha: 0,
        y: 50
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.1
      });
    }
  }, [currentPage]);

  // 禁用复制、剪切、选择内容和右键菜单
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {
      // 禁用 Ctrl+C (复制)
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        return false;
      }
      // 禁用 Ctrl+X (剪切)
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        return false;
      }
      // 禁用 Ctrl+V (粘贴)
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        return false;
      }
      // 禁用 Ctrl+A (全选)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        return false;
      }
      // 禁用 F12 (开发者工具)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // 禁用 Ctrl+Shift+I (开发者工具)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // 禁用 Ctrl+Shift+J (控制台)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      // 禁用 Ctrl+U (查看源代码)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
    };

    // 添加事件监听器
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    // 清理函数
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ScanningProvider>
      {/* 导航栏 - 只在首页显示 */}
      {currentPage === 'home' && <ModernNavbar onNavigateToGallery={navigateToGallery} onNavigateToPanorama={navigateToPanorama} />}

      <main className="relative min-h-screen w-screen overflow-x-hidden page-container">
        <div id="top"></div>

        {/* 根据当前页面显示不同内容 */}
        {currentPage === 'home' ? (
          /* 首页内容 */
          <div className="content-mobile">
            <Hero />
            <About />
            <Story />
            <Contact />
            <Footer />
          </div>
        ) : currentPage === 'gallery' ? (
          /* 相册页面 */
          <GalleryPage 
            onBackToHome={backToHome} 
            onNavigateToGallery={navigateToGallery}
            onNavigateToPanorama={navigateToPanorama}
          />
        ) : (
          /* 360度全景页面 */
          <PanoramaPage 
            onBackToHome={backToHome} 
            onNavigateToGallery={navigateToGallery}
            onNavigateToPanorama={navigateToPanorama}
          />
        )}
      </main>
    </ScanningProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
