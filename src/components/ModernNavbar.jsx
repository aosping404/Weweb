import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './ModernNavbar.css';

const ModernNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const menuButtonRef = useRef(null);
  const menuButtonTextsRef = useRef([]);
  const menuButtonIconRef = useRef(null);
  const bgPanelsRef = useRef([]);
  const menuLinksRef = useRef([]);
  const fadeTargetsRef = useRef([]);

  // 导航项目
  const navItems = [
    { name: "360度全景", href: "#panorama" },
    { name: "随机标语", href: "#story" },
    { name: "相册", href: "#gallery" }
  ];

  // 联系我单独放在底部
  const contactItem = { name: "联系我", href: "#contact" };

  // 社交链接
  const socialLinks = [
    { name: "GitHub", href: "https://github.com" },
    { name: "LinkedIn", href: "https://linkedin.com" },
    { name: "Twitter", href: "https://twitter.com" },
    { name: "Instagram", href: "https://instagram.com" }
  ];

  useEffect(() => {
    // 初始化GSAP设置
    gsap.set(menuRef.current, { display: "none" });
    
    // 确保Menu文字初始可见
    if (menuButtonTextsRef.current[0]) {
      gsap.set(menuButtonTextsRef.current[0], { yPercent: 0 });
    }
    if (menuButtonTextsRef.current[1]) {
      gsap.set(menuButtonTextsRef.current[1], { yPercent: 125 });
    }
    
    // 注册自定义缓动
    gsap.registerPlugin();
    gsap.defaults({
      ease: "power2.inOut",
      duration: 0.7
    });
  }, []);

  const openMenu = () => {
    setIsMenuOpen(true);
    
    const tl = gsap.timeline();
    
    tl.clear()
      .set(menuRef.current, { display: "block" })
      .set(menuRef.current, { xPercent: 0 }, "<")
      .fromTo(menuButtonTextsRef.current, 
        { yPercent: 0 }, 
        { yPercent: -125, stagger: 0.2, duration: 0.3 })
      .fromTo(menuButtonIconRef.current, 
        { rotate: 0 }, 
        { rotate: 315 }, "<")
      .fromTo(overlayRef.current, 
        { autoAlpha: 0 }, 
        { autoAlpha: 1 }, "<")
      .fromTo(bgPanelsRef.current, 
        { xPercent: 101 }, 
        { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
      .fromTo(menuLinksRef.current, 
        { yPercent: 140, rotate: 10 }, 
        { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35")
      .fromTo(fadeTargetsRef.current, 
        { autoAlpha: 0, yPercent: 50 }, 
        { autoAlpha: 1, yPercent: 0, stagger: 0.04 }, "<+=0.2");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    
    const tl = gsap.timeline();
    
    tl.clear()
      .to(overlayRef.current, { autoAlpha: 0 })
      .to(menuRef.current, { xPercent: 120 }, "<")
      .fromTo(menuButtonTextsRef.current, 
        { yPercent: -125 }, 
        { yPercent: 0, stagger: 0.2, duration: 0.3 }, "<")
      .to(menuButtonIconRef.current, { rotate: 0 }, "<")
      .set(menuRef.current, { display: "none" });
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-3">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href="#top" 
              className="navbar-logo"
            >
              <img 
                src="/img/logo_big.png" 
                alt="Aos 时雨" 
                className="logo-image"
              />
            </a>

            {/* 菜单按钮 */}
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="menu-button"
            >
              <div className="menu-button-text">
                <p 
                  ref={el => menuButtonTextsRef.current[0] = el}
                >
                  Menu
                </p>
                <p 
                  ref={el => menuButtonTextsRef.current[1] = el}
                >
                  Close
                </p>
              </div>
              <div className="menu-button-icon">
                <svg 
                  ref={menuButtonIconRef}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* 全屏菜单 */}
      <div 
        ref={navRef}
        className={`fixed inset-0 z-40 ${isMenuOpen ? 'block' : 'hidden'}`}
        data-nav={isMenuOpen ? "open" : "closed"}
      >
        {/* 遮罩层 */}
        <div 
          ref={overlayRef}
          onClick={closeMenu}
          className="menu-overlay"
        />

        {/* 菜单内容 */}
        <nav 
          ref={menuRef}
          className="menu-panel"
        >
          {/* 背景面板 */}
          <div className="menu-bg-panels">
            <div 
              ref={el => bgPanelsRef.current[0] = el}
              className="menu-bg-panel first"
            />
            <div 
              ref={el => bgPanelsRef.current[1] = el}
              className="menu-bg-panel second"
            />
            <div 
              ref={el => bgPanelsRef.current[2] = el}
              className="menu-bg-panel third"
            />
          </div>

          {/* 菜单内容 */}
          <div className="menu-content">
            {/* 导航链接 */}
            <ul className="menu-nav">
              {navItems.map((item, index) => (
                <li key={index} className="menu-nav-item">
                  <a
                    ref={el => menuLinksRef.current[index] = el}
                    href={item.href}
                    onClick={(e) => {
                      closeMenu();
                      // 让浏览器自然滚动到对应位置
                    }}
                    className="menu-nav-link"
                  >
                    <div className="menu-nav-link-content">
                      <span className="menu-nav-link-text">
                        {item.name}
                      </span>
                      <span className="menu-nav-link-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="menu-nav-link-bg" />
                  </a>
                </li>
              ))}
            </ul>

            {/* 联系我 */}
            <div className="menu-contact">
              <a
                ref={el => fadeTargetsRef.current[0] = el}
                href={contactItem.href}
                onClick={(e) => {
                  closeMenu();
                  // 让浏览器自然滚动到对应位置
                }}
                className="menu-contact-link"
              >
                <div className="menu-contact-link-content">
                  <span className="menu-contact-link-text">
                    {contactItem.name}
                  </span>
                  <span className="menu-contact-link-number">
                    04
                  </span>
                </div>
                <div className="menu-contact-link-bg" />
              </a>
            </div>

            {/* 社交链接 */}
            <div className="menu-socials">
              <p 
                ref={el => fadeTargetsRef.current[1] = el}
                className="menu-socials-label"
              >
                Socials
              </p>
              <div className="menu-socials-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    ref={el => fadeTargetsRef.current[index + 2] = el}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-social-link"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>

    </>
  );
};

export default ModernNavbar;
