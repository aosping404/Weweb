import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import './CosmicGallery.css';

// 注册Observer插件
gsap.registerPlugin(Observer);

const CosmicGalleryReplacement = () => {
  const slidesRef = useRef(null);
  const [slideshow, setSlideshow] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 图片数据 - 使用源代码中的cosmic系列图片
  const cosmicImages = [
    "https://cdn.cosmos.so/1d4dbaff-8087-4451-a727-9d3266b573dd?format=jpeg",
    "https://cdn.cosmos.so/67ef01f5-09c8-4117-9199-04ec5323d64f?format=jpeg",
    "https://cdn.cosmos.so/77f73423-0eb7-4eaa-a782-036457985290?format=jpeg",
    "https://cdn.cosmos.so/3dd498a9-169d-4b69-8e2e-df042123c124?format=jpeg",
    "https://cdn.cosmos.so/ca346107-04c8-4241-85e6-f26c8b64c85c?format=jpeg",
    "https://cdn.cosmos.so/7d2c5113-b2d3-4f9d-8215-f46fbb679f31?format=jpeg"
  ];

  // 幻灯片标题
  const slideTitles = [
    "Cosmic Harmony",
    "Astral Journey", 
    "Ethereal Vision",
    "Quantum Field",
    "Celestial Path",
    "Cosmic Whisper"
  ];

  // 方向常量
  const NEXT = 1;
  const PREV = -1;

  // 全局变量
  let currentHoveredThumb = null;
  let mouseOverThumbnails = false;
  let lastHoveredThumbIndex = null;
  let isAnimating = false;
  let pendingNavigation = null;

  // 更新导航UI的函数
  const updateNavigationUI = (disabled) => {
    const navButtons = document.querySelectorAll(".counter-nav");
    navButtons.forEach((btn) => {
      btn.style.opacity = disabled ? "0.3" : "";
      btn.style.pointerEvents = disabled ? "none" : "";
    });

    const thumbs = document.querySelectorAll(".cosmic-gallery .slide-thumb");
    thumbs.forEach((thumb) => {
      thumb.style.pointerEvents = disabled ? "none" : "";
    });
  };

  // 更新幻灯片计数器
  const updateSlideCounter = (index) => {
    const currentSlideEl = document.querySelector(".current-slide");
    if (currentSlideEl) {
      currentSlideEl.textContent = String(index + 1).padStart(2, "0");
    }
  };

  // 更新幻灯片标题
  const updateSlideTitle = (index) => {
    const titleContainer = document.querySelector(".slide-title-container");
    const currentTitle = document.querySelector(".slide-title");
    if (!titleContainer || !currentTitle) return;

    const newTitle = document.createElement("div");
    newTitle.className = "slide-title enter-up";
    newTitle.textContent = slideTitles[index];

    titleContainer.appendChild(newTitle);
    currentTitle.classList.add("exit-up");

    void newTitle.offsetWidth;

    setTimeout(() => {
      newTitle.classList.remove("enter-up");
    }, 10);

    setTimeout(() => {
      currentTitle.remove();
    }, 500);
  };

  // 更新拖拽线条
  const updateDragLines = (activeIndex, forceUpdate = false) => {
    const lines = document.querySelectorAll(".drag-line");
    if (!lines.length) return;

    lines.forEach((line) => {
      line.style.height = "var(--line-base-height)";
      line.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    });

    if (activeIndex === null) {
      return;
    }

    const slideCount = cosmicImages.length;
    const lineCount = lines.length;

    const thumbWidth = 720 / slideCount;
    const centerPosition = (activeIndex + 0.5) * thumbWidth;
    const lineWidth = 720 / lineCount;

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

  // 幻灯片类
  class Slideshow {
    constructor(DOM_el) {
      this.DOM = {
        el: DOM_el,
        slides: [...DOM_el.querySelectorAll(".slide")],
        slidesInner: null
      };
      this.DOM.slidesInner = this.DOM.slides.map((item) =>
        item.querySelector(".slide__img")
      );
      this.slidesTotal = this.DOM.slides.length;
      this.current = 0;
      
      // 确保有幻灯片存在再添加class
      if (this.DOM.slides.length > 0 && this.DOM.slides[this.current]) {
        this.DOM.slides[this.current].classList.add("slide--current");
      }
    }

    next() {
      this.navigate(NEXT);
    }

    prev() {
      this.navigate(PREV);
    }

    goTo(index) {
      if (isAnimating) {
        pendingNavigation = { type: "goto", index };
        return false;
      }

      if (index === this.current) return false;

      isAnimating = true;
      updateNavigationUI(true);

      const previous = this.current;
      this.current = index;

      const thumbs = document.querySelectorAll(".cosmic-gallery .slide-thumb");
      thumbs.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === index);
      });

      updateSlideCounter(index);
      updateSlideTitle(index);
      updateDragLines(index, true);

      const direction = index > previous ? 1 : -1;
      const currentSlide = this.DOM.slides[previous];
      const currentInner = this.DOM.slidesInner[previous];
      const upcomingSlide = this.DOM.slides[index];
      const upcomingInner = this.DOM.slidesInner[index];

      gsap
        .timeline({
          onStart: () => {
            this.DOM.slides[index].classList.add("slide--current");
            gsap.set(upcomingSlide, { zIndex: 99 });
          },
          onComplete: () => {
            this.DOM.slides[previous].classList.remove("slide--current");
            gsap.set(upcomingSlide, { zIndex: 1 });

            isAnimating = false;
            updateNavigationUI(false);

            if (pendingNavigation) {
              const { type, index, direction } = pendingNavigation;
              pendingNavigation = null;

              setTimeout(() => {
                if (type === "goto") {
                  this.goTo(index);
                } else if (type === "navigate") {
                  this.navigate(direction);
                }
              }, 50);
            }

            if (mouseOverThumbnails && lastHoveredThumbIndex !== null) {
              currentHoveredThumb = lastHoveredThumbIndex;
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
          currentSlide,
          {
            duration: 1,
            ease: "power4.inOut",
            scale: 0.98,
            autoAlpha: 0
          },
          "middle"
        );
    }

    navigate(direction) {
      if (isAnimating) {
        pendingNavigation = { type: "navigate", direction };
        return false;
      }

      isAnimating = true;
      updateNavigationUI(true);

      const previous = this.current;
      this.current =
        direction === 1
          ? this.current < this.slidesTotal - 1
            ? ++this.current
            : 0
          : this.current > 0
          ? --this.current
          : this.slidesTotal - 1;

      const thumbs = document.querySelectorAll(".cosmic-gallery .slide-thumb");
      thumbs.forEach((thumb, index) => {
        if (index === this.current) {
          thumb.classList.add("active");
        } else {
          thumb.classList.remove("active");
        }
      });

      updateSlideCounter(this.current);
      updateSlideTitle(this.current);
      updateDragLines(this.current, true);

      const currentSlide = this.DOM.slides[previous];
      const currentInner = this.DOM.slidesInner[previous];
      const upcomingSlide = this.DOM.slides[this.current];
      const upcomingInner = this.DOM.slidesInner[this.current];

      gsap
        .timeline({
          onStart: () => {
            this.DOM.slides[this.current].classList.add("slide--current");
            gsap.set(upcomingSlide, { zIndex: 99 });
          },
          onComplete: () => {
            this.DOM.slides[previous].classList.remove("slide--current");
            gsap.set(upcomingSlide, { zIndex: 1 });

            isAnimating = false;
            updateNavigationUI(false);

            if (pendingNavigation) {
              const { type, index, direction } = pendingNavigation;
              pendingNavigation = null;

              setTimeout(() => {
                if (type === "goto") {
                  this.goTo(index);
                } else if (type === "navigate") {
                  this.navigate(direction);
                }
              }, 50);
            }

            if (mouseOverThumbnails && lastHoveredThumbIndex !== null) {
              currentHoveredThumb = lastHoveredThumbIndex;
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
          currentSlide,
          {
            duration: 1,
            ease: "power4.inOut",
            scale: 0.98,
            autoAlpha: 0
          },
          "middle"
        );
    }
  }

  useEffect(() => {
    if (!slidesRef.current || isInitialized) return;

    // 初始化滚动和触摸事件
    let currentSlideshowInstance = null;
    let observerInstance = null;
    
    // 键盘导航
    const handleKeyDown = (e) => {
      if (isAnimating) return;
      
      // 阻止事件冒泡
      e.stopPropagation();

      if (e.key === "ArrowRight" && currentSlideshowInstance) {
        console.log("Arrow right - next");
        currentSlideshowInstance.next();
      } else if (e.key === "ArrowLeft" && currentSlideshowInstance) {
        console.log("Arrow left - prev");
        currentSlideshowInstance.prev();
      }
    };

    // 更新slideshow实例引用的函数
    const updateSlideshowReference = (instance) => {
      currentSlideshowInstance = instance;
    };

    // 等待DOM完全渲染
    const initSlideshow = () => {
      const slides = slidesRef.current.querySelectorAll(".slide");
      if (slides.length === 0) {
        // 如果幻灯片还没有渲染，等待一下再试
        setTimeout(initSlideshow, 100);
        return;
      }

      // 创建幻灯片实例
      const slideshowInstance = new Slideshow(slidesRef.current);
      setSlideshow(slideshowInstance);
      
      // 立即初始化其他功能
      initializeComponents(slideshowInstance);
    };

    const initializeComponents = (slideshowInstance) => {
      // 创建缩略图
      const createThumbnails = () => {
        const thumbsContainer = document.querySelector(".cosmic-gallery .slide-thumbs");
        if (thumbsContainer) {
          thumbsContainer.innerHTML = "";
          cosmicImages.forEach((imgSrc, index) => {
            const thumb = document.createElement("div");
            thumb.className = "slide-thumb";
            thumb.style.backgroundImage = `url(${imgSrc})`;
            if (index === 0) {
              thumb.classList.add("active");
            }

            thumb.addEventListener("click", () => {
              console.log("Thumbnail clicked:", index);
              lastHoveredThumbIndex = index;
              slideshowInstance.goTo(index);
            });

            thumb.addEventListener("mouseenter", () => {
              currentHoveredThumb = index;
              lastHoveredThumbIndex = index;
              mouseOverThumbnails = true;

              if (!isAnimating) {
                updateDragLines(index, true);
              }
            });

            thumb.addEventListener("mouseleave", () => {
              if (currentHoveredThumb === index) {
                currentHoveredThumb = null;
              }
            });

            thumbsContainer.appendChild(thumb);
          });
        }
      };

      // 创建拖拽指示器线条
      const createDragLines = () => {
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
      };

      // 设置总幻灯片数
      const setTotalSlides = () => {
        const totalSlidesEl = document.querySelector(".total-slides");
        if (totalSlidesEl) {
          totalSlidesEl.textContent = String(cosmicImages.length).padStart(2, "0");
        }
      };

      // 添加导航处理器
      const addNavigationHandlers = () => {
        const prevButton = document.querySelector(".prev-slide");
        const nextButton = document.querySelector(".next-slide");

        if (prevButton) {
          prevButton.addEventListener("click", () => {
            console.log("Prev button clicked");
            slideshowInstance.prev();
          });
        }

        if (nextButton) {
          nextButton.addEventListener("click", () => {
            console.log("Next button clicked");
            slideshowInstance.next();
          });
        }
      };

      // 添加全局鼠标离开处理器
      const addMouseHandlers = () => {
        const thumbsArea = document.querySelector(".thumbs-container");
        if (thumbsArea) {
          thumbsArea.addEventListener("mouseenter", () => {
            mouseOverThumbnails = true;
          });

          thumbsArea.addEventListener("mouseleave", () => {
            mouseOverThumbnails = false;
            currentHoveredThumb = null;
            updateDragLines(null);
          });
        }
      };

      // 执行所有初始化
      createThumbnails();
      createDragLines();
      setTotalSlides();
      addNavigationHandlers();
      addMouseHandlers();
      
      // 初始化计数器和线条
      updateSlideCounter(0);
      updateDragLines(0, true);
      
      // 更新全局slideshow引用
      if (typeof updateSlideshowReference === 'function') {
        updateSlideshowReference(slideshowInstance);
      }
    };

    initSlideshow();

    // 初始化GSAP Observer
    const initObserver = () => {
      if (observerInstance) {
        observerInstance.kill();
      }
      
      observerInstance = Observer.create({
        type: "touch,pointer", // 移除wheel，禁用滚轮翻页
        onDown: () => {
          if (!isAnimating && currentSlideshowInstance) {
            console.log("Observer down - prev");
            currentSlideshowInstance.prev();
          }
        },
        onUp: () => {
          if (!isAnimating && currentSlideshowInstance) {
            console.log("Observer up - next");
            currentSlideshowInstance.next();
          }
        },
        tolerance: 10,
        target: slidesRef.current
      });
    };

    // 延迟初始化Observer，确保DOM已准备好
    setTimeout(initObserver, 100);

    // 添加键盘事件监听器
    document.addEventListener("keydown", handleKeyDown, { capture: true });

    setIsInitialized(true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      if (observerInstance) {
        observerInstance.kill();
      }
    };
  }, [isInitialized]);

  return (
    <div className="cosmic-gallery">
      <div className="scroll-hint">scroll or drag</div>

      {/* 底部UI容器 */}
      <div className="bottom-ui-container">
        <div className="slide-section">COSMIC SERIES</div>
        <div className="slide-counter">
          <div className="counter-nav prev-slide">⟪</div>
          <div className="counter-display">
            <span className="current-slide">01</span>
            <span className="counter-divider">//</span>
            <span className="total-slides">06</span>
          </div>
          <div className="counter-nav next-slide">⟫</div>
        </div>
        <div className="slide-title-container">
          <div className="slide-title">Cosmic Harmony</div>
        </div>
        <div className="drag-indicator"></div>
        <div className="thumbs-container">
          <div className="frost-bg"></div>
          <div className="slide-thumbs"></div>
        </div>
      </div>

      {/* 幻灯片容器 */}
      <div className="slides" ref={slidesRef}>
        {cosmicImages.map((imgSrc, index) => (
          <div key={index} className="slide">
            <div 
              className="slide__img" 
              style={{ backgroundImage: `url(${imgSrc})` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CosmicGalleryReplacement;