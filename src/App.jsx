import About from "./components/About";
import Hero from "./components/Hero";
import ModernNavbar from "./components/ModernNavbar";
import CosmicGallery from "./components/CosmicGallery";
import Panorama from "./components/Panorama";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useEffect } from "react";
import { ScanningProvider } from "./context/ScanningContext";


function AppContent() {
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
      <main className="relative min-h-screen w-screen overflow-x-hidden bg-[#0a0a0f] page-container">
        <div id="top"></div>
        
        {/* 导航栏 */}
        <ModernNavbar />
        
        {/* 页面内容 */}
        <div className="content-mobile">
          <Hero />
          <About />
          <Panorama />
          <Story />
          <CosmicGallery />
          <Contact />
          <Footer />
        </div>
      </main>
    </ScanningProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
