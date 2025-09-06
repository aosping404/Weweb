import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { FaMusic, FaPause } from "react-icons/fa";

import Button from "./Button";

const navItems = ["首页", "关于我们", "联系我们"];

const NavBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Manage audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo and Product button */}
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-10" />

            <Button
              id="product-button"
              title="学校官网"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-gray-700 md:flex hidden items-center justify-center gap-1 border-2 border-white"
              onClick={() => window.open('https://nsu.edu.cn/', '_blank')}
            />
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            <div className="flex items-center space-x-4">
              {navItems.map((item, index) => {
                let href = "#top";
                if (item === "关于我们") href = "#about";
                if (item === "联系我们") href = "#contact";

                return (
                  <a
                    key={index}
                    href={href}
                    className="nav-hover-btn text-base md:text-sm"
                  >
                    {item}
                  </a>
                );
              })}
            </div>

            <button
              onClick={toggleAudioIndicator}
              className="ml-4 flex items-center justify-center w-12 h-12 hover:bg-gray-800 transition-colors duration-300"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/Hidden_love.mp3"
                loop
              />
              {isAudioPlaying ? (
                <FaPause className="text-white text-lg" />
              ) : (
                <div className="flex items-end space-x-1 h-6">
                  <div className="w-1.5 h-4 bg-white rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0ms', animationDuration: '0.6s' }}></div>
                  <div className="w-1.5 h-5 bg-white rounded-full animate-bounce shadow-sm" style={{ animationDelay: '100ms', animationDuration: '0.8s' }}></div>
                  <div className="w-1.5 h-3 bg-white rounded-full animate-bounce shadow-sm" style={{ animationDelay: '200ms', animationDuration: '0.7s' }}></div>
                  <div className="w-1.5 h-6 bg-white rounded-full animate-bounce shadow-sm" style={{ animationDelay: '300ms', animationDuration: '0.9s' }}></div>
                </div>
              )}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
