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
      <div ref={buttonRef} className="fixed left-[55px] top-1/2 -translate-y-1/2 z-[9999]">
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
