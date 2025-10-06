import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import './CosmicGallery.css';

// 注册 GSAP 插件
gsap.registerPlugin(Observer);

// 方向常量
const NEXT = 1;
const PREV = -1;

// 幻灯片标题数组
const slideTitles = [
  "Cosmic Harmony",
  "Astral Journey", 
  "Ethereal Vision",
  "Quantum Field",
  "Celestial Path",
  "Cosmic Whisper"
];

// 示例图片数据
const defaultImages = [
  "https://cdn.cosmos.so/1d4dbaff-8087-4451-a727-9d3266b573dd?format=jpeg",
  "/mypub/image_19.jpg",
  "/mypub/image_24.jpg",
  "https://cdn.cosmos.so/3dd498a9-169d-4b69-8e2e-df042123c124?format=jpeg",
  "https://cdn.cosmos.so/ca346107-04c8-4241-85e6-f26c8b64c85c?format=jpeg",
  "https://cdn.cosmos.so/7d2c5113-b2d3-4f9d-8215-f46fbb679f31?format=jpeg"
];

const CosmicGallery = ({ images = defaultImages, titles = slideTitles }) => {
  const slidesRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentHoveredThumb, setCurrentHoveredThumb] = useState(null);
  const [mouseOverThumbnails, setMouseOverThumbnails] = useState(false);
  const [lastHoveredThumbIndex, setLastHoveredThumbIndex] = useState(null);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  
  const slideshowRef = useRef(null);

  // 更新导航UI状态
  const updateNavigationUI = (disabled) => {
    const navButtons = document.querySelectorAll(".counter-nav");
    navButtons.forEach((btn) => {
      btn.style.opacity = disabled ? "0.3" : "";
      btn.style.pointerEvents = disabled ? "none" : "";
    });

    const thumbs = document.querySelectorAll(".slide-thumb");
    thumbs.forEach((thumb) => {
      thumb.style.pointerEvents = disabled ? "none" : "";
    });
  };

  // 更新拖拽线条效果
  const updateDragLines = (activeIndex, forceUpdate = false) => {
    const lines = document.querySelectorAll(".drag-line");
    if (!lines.length) return;

    // 重置所有线条
    lines.forEach((line) => {
      line.style.height = "var(--line-base-height)";
      line.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    });

    if (activeIndex === null) return;

    const slideCount = images.length;
    const lineCount = lines.length;

    // 计算活动缩略图的中心位置
    const thumbWidth = 720 / slideCount;
    const centerPosition = (activeIndex + 0.5) * thumbWidth;
    const lineWidth = 720 / lineCount;

    // 应用波浪模式到所有线条
    for (let i = 0; i < lineCount; i++) {
      const linePosition = (i + 0.5) * lineWidth;
      const distFromCenter = Math.abs(linePosition - centerPosition);
      const maxDistance = thumbWidth * 0.7;

      if (distFromCenter <= maxDistance) {
        const normalizedDist = distFromCenter / maxDistance;
        const waveHeight = Math.cos((normalizedDist * Math.PI) / 2);
        const height = 15 + waveHeight * 35;
        const opacity = 0.3 + waveHeight * 0.4;
        const delay = normalizedDist * 100;

        if (forceUpdate) {
          lines[i].style.height = `${height}px`;
          lines[i].style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
        } else {
          setTimeout(() => {
            if (
              currentHoveredThumb === activeIndex ||
              (mouseOverThumbnails && lastHoveredThumbIndex === activeIndex)
            ) {
              lines[i].style.height = `${height}px`;
              lines[i].style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
            }
          }, delay);
        }
      }
    }
  };

  // 导航到指定幻灯片
  const goToSlide = (index) => {
    if (isAnimating) {
      setPendingNavigation({ type: "goto", index });
      return false;
    }

    if (index === currentSlide) return false;

    setIsAnimating(true);
    updateNavigationUI(true);

    const previous = currentSlide;
    setCurrentSlide(index);

    // 更新活动缩略图
    const thumbs = document.querySelectorAll(".slide-thumb");
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });

    // 显示拖拽线条
    updateDragLines(index, true);

    // 确定动画方向
    const direction = index > previous ? 1 : -1;

    // 获取幻灯片元素
    const slides = document.querySelectorAll(".slide");
    const currentSlideEl = slides[previous];
    const currentInner = currentSlideEl?.querySelector(".slide__img");
    const upcomingSlide = slides[index];
    const upcomingInner = upcomingSlide?.querySelector(".slide__img");

    if (!currentSlideEl || !upcomingSlide || !currentInner || !upcomingInner) return;

    gsap
      .timeline({
        onStart: () => {
          upcomingSlide.classList.add("slide--current");
          gsap.set(upcomingSlide, { zIndex: 5 }); /* 降低照片的 z-index */
        },
        onComplete: () => {
          currentSlideEl.classList.remove("slide--current");
          gsap.set(upcomingSlide, { zIndex: 1 });

          setIsAnimating(false);
          updateNavigationUI(false);

          // 处理待处理的导航
          if (pendingNavigation) {
            const { type, index: pendingIndex, direction: pendingDirection } = pendingNavigation;
            setPendingNavigation(null);

            setTimeout(() => {
              if (type === "goto") {
                goToSlide(pendingIndex);
              } else if (type === "navigate") {
                navigate(pendingDirection);
              }
            }, 50);
          }

          // 重新应用悬停效果
          if (mouseOverThumbnails && lastHoveredThumbIndex !== null) {
            setCurrentHoveredThumb(lastHoveredThumbIndex);
            updateDragLines(lastHoveredThumbIndex, true);
          }
        }
      })
      .addLabel("start", 0)
      .fromTo(
        upcomingSlide,
        {
          autoAlpha: 1,
          scale: 0.1,
          yPercent: direction === 1 ? 100 : -100
        },
        {
          duration: 0.7,
          ease: "expo",
          scale: 0.4,
          yPercent: 0
        },
        "start"
      )
      .fromTo(
        upcomingInner,
        {
          filter: "contrast(100%) saturate(100%)",
          transformOrigin: "100% 50%",
          scaleY: 4
        },
        {
          duration: 0.7,
          ease: "expo",
          scaleY: 1
        },
        "start"
      )
      .fromTo(
        currentInner,
        {
          filter: "contrast(100%) saturate(100%)"
        },
        {
          duration: 0.7,
          ease: "expo",
          filter: "contrast(120%) saturate(140%)"
        },
        "start"
      )
      .addLabel("middle", "start+=0.6")
      .to(
        upcomingSlide,
        {
          duration: 1,
          ease: "power4.inOut",
          scale: 1
        },
        "middle"
      )
      .to(
        currentSlideEl,
        {
          duration: 1,
          ease: "power4.inOut",
          scale: 0.98,
          autoAlpha: 0
        },
        "middle"
      );
  };

  // 导航到下一张或上一张
  const navigate = (direction) => {
    if (isAnimating) {
      setPendingNavigation({ type: "navigate", direction });
      return false;
    }

    setIsAnimating(true);
    updateNavigationUI(true);

    const previous = currentSlide;
    let newIndex;
    
    if (direction === 1) {
      newIndex = currentSlide < images.length - 1 ? currentSlide + 1 : 0;
    } else {
      newIndex = currentSlide > 0 ? currentSlide - 1 : images.length - 1;
    }

    setCurrentSlide(newIndex);

    // 更新活动缩略图
    const thumbs = document.querySelectorAll(".slide-thumb");
    thumbs.forEach((thumb, index) => {
      thumb.classList.toggle("active", index === newIndex);
    });

    // 显示拖拽线条
    updateDragLines(newIndex, true);

    // 获取幻灯片元素
    const slides = document.querySelectorAll(".slide");
    const currentSlideEl = slides[previous];
    const currentInner = currentSlideEl?.querySelector(".slide__img");
    const upcomingSlide = slides[newIndex];
    const upcomingInner = upcomingSlide?.querySelector(".slide__img");

    if (!currentSlideEl || !upcomingSlide || !currentInner || !upcomingInner) return;

    gsap
      .timeline({
        onStart: () => {
          upcomingSlide.classList.add("slide--current");
          gsap.set(upcomingSlide, { zIndex: 5 }); /* 降低照片的 z-index */
        },
        onComplete: () => {
          currentSlideEl.classList.remove("slide--current");
          gsap.set(upcomingSlide, { zIndex: 1 });

          setIsAnimating(false);
          updateNavigationUI(false);

          // 处理待处理的导航
          if (pendingNavigation) {
            const { type, index: pendingIndex, direction: pendingDirection } = pendingNavigation;
            setPendingNavigation(null);

            setTimeout(() => {
              if (type === "goto") {
                goToSlide(pendingIndex);
              } else if (type === "navigate") {
                navigate(pendingDirection);
              }
            }, 50);
          }

          // 重新应用悬停效果
          if (mouseOverThumbnails && lastHoveredThumbIndex !== null) {
            setCurrentHoveredThumb(lastHoveredThumbIndex);
            updateDragLines(lastHoveredThumbIndex, true);
          }
        }
      })
      .addLabel("start", 0)
      .fromTo(
        upcomingSlide,
        {
          autoAlpha: 1,
          scale: 0.1,
          yPercent: direction === 1 ? 100 : -100
        },
        {
          duration: 0.7,
          ease: "expo",
          scale: 0.4,
          yPercent: 0
        },
        "start"
      )
      .fromTo(
        upcomingInner,
        {
          filter: "contrast(100%) saturate(100%)",
          transformOrigin: "100% 50%",
          scaleY: 4
        },
        {
          duration: 0.7,
          ease: "expo",
          scaleY: 1
        },
        "start"
      )
      .fromTo(
        currentInner,
        {
          filter: "contrast(100%) saturate(100%)"
        },
        {
          duration: 0.7,
          ease: "expo",
          filter: "contrast(120%) saturate(140%)"
        },
        "start"
      )
      .addLabel("middle", "start+=0.6")
      .to(
        upcomingSlide,
        {
          duration: 1,
          ease: "power4.inOut",
          scale: 1
        },
        "middle"
      )
      .to(
        currentSlideEl,
        {
          duration: 1,
          ease: "power4.inOut",
          scale: 0.98,
          autoAlpha: 0
        },
        "middle"
      );
  };

  // 初始化组件
  useEffect(() => {
    // 创建拖拽指示器线条
    const dragIndicator = document.querySelector(".drag-indicator");
    if (dragIndicator) {
      dragIndicator.innerHTML = "";
      const linesContainer = document.createElement("div");
      linesContainer.className = "lines-container";
      dragIndicator.appendChild(linesContainer);

      const totalLines = 60;
      for (let i = 0; i < totalLines; i++) {
        const line = document.createElement("div");
        line.className = "drag-line";
        linesContainer.appendChild(line);
      }
    }

    // 初始化第一张幻灯片的线条
    updateDragLines(0, true);

    // 设置 GSAP Observer
    const observer = Observer.create({
      type: "wheel,touch,pointer",
      onDown: () => {
        if (!isAnimating) navigate(PREV);
      },
      onUp: () => {
        if (!isAnimating) navigate(NEXT);
      },
      wheelSpeed: -1,
      tolerance: 10
    });

    // 键盘导航
    const handleKeyDown = (e) => {
      if (isAnimating) return;
      if (e.key === "ArrowRight") navigate(NEXT);
      else if (e.key === "ArrowLeft") navigate(PREV);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      observer.kill();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAnimating]);

  // 缩略图悬停处理
  const handleThumbHover = (index) => {
    setCurrentHoveredThumb(index);
    setLastHoveredThumbIndex(index);
    setMouseOverThumbnails(true);
    if (!isAnimating) {
      updateDragLines(index, true);
    }
  };

  const handleThumbLeave = (index) => {
    if (currentHoveredThumb === index) {
      setCurrentHoveredThumb(null);
    }
  };

  const handleThumbnailsAreaLeave = () => {
    setMouseOverThumbnails(false);
    setCurrentHoveredThumb(null);
    updateDragLines(null);
  };

  return (
    <div className="cosmic-gallery">
      <div className="scroll-hint">scroll or drag</div>

      {/* 底部UI容器 */}
      <div className="bottom-ui-container">
        <div className="slide-section">COSMIC SERIES</div>
        <div className="slide-counter">
          <div className="counter-nav prev-slide" onClick={() => navigate(PREV)}>⟪</div>
          <div className="counter-display">
            <span className="current-slide">{String(currentSlide + 1).padStart(2, "0")}</span>
            <span className="counter-divider">//</span>
            <span className="total-slides">{String(images.length).padStart(2, "0")}</span>
          </div>
          <div className="counter-nav next-slide" onClick={() => navigate(NEXT)}>⟫</div>
        </div>
        <div className="slide-title-container">
          <div className="slide-title">{titles[currentSlide] || titles[0]}</div>
        </div>
        <div className="drag-indicator"></div>
        <div className="thumbs-container" onMouseLeave={handleThumbnailsAreaLeave}>
          <div className="frost-bg"></div>
          <div className="slide-thumbs">
            {images.map((image, index) => (
              <div
                key={index}
                className={`slide-thumb ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${image})` }}
                onClick={() => goToSlide(index)}
                onMouseEnter={() => handleThumbHover(index)}
                onMouseLeave={() => handleThumbLeave(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 幻灯片容器 */}
      <div className="slides" ref={slidesRef}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'slide--current' : ''}`}
          >
            <div
              className="slide__img"
              style={{ backgroundImage: `url(${image})` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CosmicGallery;
