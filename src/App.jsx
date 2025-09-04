import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Button from "./components/Button";
import { TiLocationArrow } from "react-icons/ti";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";


function App() {
  const { y: currentScrollY } = useWindowScroll();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 设置滚动状态
    setIsScrolling(true);

    // 设置1秒后停止滚动的定时器
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);

    setLastScrollY(currentScrollY);

    // 清理函数
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentScrollY]);

  // 招新按钮滚动动画
  useEffect(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        x: isScrolling ? -200 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isScrolling]);

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
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-[#ffffff]">
      <div id="top"></div>
      <NavBar />
      <Hero />
      <About />
      <Features />
      <Story />
      <Contact />
      <Footer />

      {/* 全局浮动按钮 */}
      <div ref={buttonRef} className="fixed left-[55px] top-3/4 -translate-y-1/2 z-[9999]">
        <Button
          id="lianjie"
          title="现在招新中！"
          leftIcon={<TiLocationArrow />}
          containerClass="bg-[#6b7280] flex-center gap-1 scale-[1.3] transform border-2 border-white"
          onClick={() => window.open('https://incredible-marzipan-055ab6.netlify.app/', '_blank')}
        />
      </div>
    </main>
  );
}

export default App;
