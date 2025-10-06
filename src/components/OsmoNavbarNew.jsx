import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './OsmoNavbarNew.css';

const OsmoNavbarNew = () => {
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
    { name: "收藏页", href: "#favorites" },
    { name: "360度全景", href: "#features" },
    { name: "随机标语", href: "#story", isPixel: true }
  ];

  // 联系我单独放在底部
  const contactItem = { name: "联系我", href: "#contact", isPixel: true };

  // 社交链接
  const socialLinks = [
    { name: "Instagram", href: "https://instagram.com" },
    { name: "LinkedIn", href: "https://linkedin.com" },
    { name: "X/Twitter", href: "https://twitter.com" },
    { name: "Awwwards", href: "https://awwwards.com" }
  ];

  useEffect(() => {
    // 初始化GSAP设置
    if (menuRef.current) {
      gsap.set(menuRef.current, { display: "none" });
    }
    
    // 注册自定义缓动
    gsap.registerPlugin();
    
    // 创建自定义缓动
    gsap.registerEase("main", "0.65, 0.01, 0.05, 0.99");
    
    gsap.defaults({
      ease: "main",
      duration: 0.7
    });
  }, []);

  const openMenu = () => {
    console.log("Opening menu...");
    setIsMenuOpen(true);
    
    const tl = gsap.timeline();
    
    tl.clear()
      .set(menuRef.current, { display: "block" })
      .set(menuRef.current, { xPercent: 0 }, "<")
      .fromTo(menuButtonTextsRef.current, 
        { yPercent: 0 }, 
        { yPercent: -100, stagger: 0.2 })
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
      .to(menuButtonTextsRef.current, { yPercent: 0 }, "<")
      .to(menuButtonIconRef.current, { rotate: 0 }, "<")
      .set(menuRef.current, { display: "none" });
  };

  const toggleMenu = () => {
    console.log("Toggle menu clicked, current state:", isMenuOpen);
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
      <header className="header">
        <div className="container is--full">
          <nav className="nav-row">
            {/* Logo */}
            <a href="#top" className="nav-logo-row">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 66 20" fill="none" className="nav-logo__wordmark">
                <path d="M9.67499 19.3499C4.32499 19.3499 0.899994 15.4249 0.899994 10.0499C0.899994 4.6749 4.32499 0.774902 9.67499 0.774902C15.025 0.774902 18.45 4.6749 18.45 10.0499C18.45 15.4249 15.025 19.3499 9.67499 19.3499ZM3.77499 10.0499C3.77499 13.7249 5.44999 16.9749 9.67499 16.9749C13.9 16.9749 15.575 13.7249 15.575 10.0499C15.575 6.3749 13.9 3.1499 9.67499 3.1499C5.44999 3.1499 3.77499 6.3749 3.77499 10.0499Z" fill="currentColor"></path>
                <path d="M25.7115 19.3499C21.8365 19.3499 19.9115 17.3499 19.8365 14.7499H22.3115C22.4115 16.2249 23.3115 17.3749 25.6865 17.3749C27.8365 17.3749 28.4115 16.4249 28.4115 15.4999C28.4115 13.8999 26.7115 13.7249 25.0615 13.3749C22.8365 12.8499 20.2865 12.1999 20.2865 9.5499C20.2865 7.3499 22.0615 5.8749 25.1365 5.8749C28.6365 5.8749 30.3115 7.7499 30.4865 9.9499H28.0115C27.8365 8.9749 27.3115 7.8499 25.1865 7.8499C23.5365 7.8499 22.8365 8.4999 22.8365 9.4499C22.8365 10.7749 24.2615 10.8999 26.0615 11.2999C28.4115 11.8499 30.9615 12.5249 30.9615 15.3749C30.9615 17.8499 29.0615 19.3499 25.7115 19.3499Z" fill="currentColor"></path>
                <path d="M40.5435 10.8249C40.5435 9.1249 40.1935 7.9749 38.3186 7.9749C36.4936 7.9749 35.3435 9.2499 35.3435 11.1749V18.9999H32.8935V6.2499H35.3435V7.8499H35.3935C36.0685 6.8749 37.2435 5.8749 39.1685 5.8749C40.9435 5.8749 42.0435 6.6749 42.5435 8.0999H42.5935C43.5185 6.8749 44.8185 5.8749 46.7685 5.8749C49.3435 5.8749 50.6436 7.4249 50.6436 10.1499V18.9999H48.1936V10.8249C48.1936 9.1249 47.8435 7.9749 45.9685 7.9749C44.1435 7.9749 42.9935 9.2499 42.9935 11.1749V18.9999H40.5435V10.8249Z" fill="currentColor"></path>
                <path d="M59.0281 19.3749C55.0531 19.3749 52.6531 16.6249 52.6531 12.6249C52.6531 8.6499 55.0531 5.8499 59.0531 5.8499C63.0031 5.8499 65.4031 8.6249 65.4031 12.5999C65.4031 16.5999 63.0031 19.3749 59.0281 19.3749ZM55.2031 12.6249C55.2031 15.2749 56.4031 17.3499 59.0531 17.3499C61.6531 17.3499 62.8531 15.2749 62.8531 12.6249C62.8531 9.9499 61.6531 7.8999 59.0531 7.8999C56.4031 7.8999 55.2031 9.9499 55.2031 12.6249Z" fill="currentColor"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 160 160" fill="none" className="nav-logo__icon">
                <path d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z" fill="currentColor"></path>
              </svg>
            </a>

            {/* 菜单按钮 */}
            <div className="nav-row__right">
              <button
                ref={menuButtonRef}
                onClick={toggleMenu}
                className="menu-button"
                data-menu-toggle=""
              >
                <div className="menu-button-text">
                  <p 
                    ref={el => menuButtonTextsRef.current[0] = el}
                    className="p-large art-font"
                  >
                    Menu
                  </p>
                  <p 
                    ref={el => menuButtonTextsRef.current[1] = el}
                    className="p-large art-font"
                  >
                    Close
                  </p>
                </div>
                <div className="icon-wrap">
                  <svg 
                    ref={menuButtonIconRef}
                    className="menu-button-icon"
                    xmlns="http://www.w3.org/2000/svg" 
                    width="100%" 
                    viewBox="0 0 16 16" 
                    fill="none"
                  >
                    <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor"></path>
                    <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor"></path>
                    <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor"></path>
                    <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor"></path>
                    <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor"></path>
                    <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor"></path>
                  </svg>
                </div>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* 全屏菜单 */}
      <div 
        ref={navRef}
        className={`nav ${isMenuOpen ? 'nav--open' : 'nav--closed'}`}
        data-nav={isMenuOpen ? "open" : "closed"}
      >
        {/* 遮罩层 */}
        <div 
          ref={overlayRef}
          onClick={closeMenu}
          className="overlay"
          data-menu-toggle=""
        />

        {/* 菜单内容 */}
        <nav ref={menuRef} className="menu">
          {/* 背景面板 */}
          <div className="menu-bg">
            <div 
              ref={el => bgPanelsRef.current[0] = el}
              className="bg-panel first"
            />
            <div 
              ref={el => bgPanelsRef.current[1] = el}
              className="bg-panel second"
            />
            <div 
              ref={el => bgPanelsRef.current[2] = el}
              className="bg-panel"
            />
          </div>

          {/* 菜单内容 */}
          <div className="menu-inner">
            {/* 导航链接 */}
            <ul className="menu-list">
              {navItems.map((item, index) => (
                <li key={index} className="menu-list-item">
                  <a
                    ref={el => menuLinksRef.current[index] = el}
                    href={item.href}
                    onClick={(e) => {
                      closeMenu();
                      // 让浏览器自然滚动到对应位置
                    }}
                    className="menu-link"
                  >
                    <p className={`menu-link-heading ${item.isPixel ? 'pixel-font' : 'art-font'}`}>
                      {item.name}
                    </p>
                    <p className="eyebrow art-font">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <div className="menu-link-bg" />
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
                className="menu-link"
                data-menu-fade=""
              >
                <p className={`menu-link-heading ${contactItem.isPixel ? 'pixel-font' : 'art-font'}`}>
                  {contactItem.name}
                </p>
                <p className="eyebrow art-font">
                  06
                </p>
                <div className="menu-link-bg" />
              </a>
            </div>

            {/* 社交链接 */}
            <div className="menu-details">
              <p 
                ref={el => fadeTargetsRef.current[1] = el}
                className="p-small art-font"
                data-menu-fade=""
              >
                Socials
              </p>
              <div className="socials-row">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    ref={el => fadeTargetsRef.current[index + 2] = el}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-large text-link art-font"
                    data-menu-fade=""
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

export default OsmoNavbarNew;
