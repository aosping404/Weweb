import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import Lenis from 'lenis';
import imagesLoaded from 'imagesloaded';
import './OnScrollShapeMorph.css';

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger, Observer);

// 工具函数
const lerp = (a, b, n) => (1 - n) * a + n * b;

const getCursorPos = ev => {
    return {
        x : ev.clientX,
        y : ev.clientY
    };
};

const map = (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c;

const calcWinsize = () => {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    }
};

// InteractiveTilt 类 - 鼠标跟随的3D倾斜效果
class InteractiveTilt {
    DOM = {
        el: null,
        wrapEl: null
    };

    defaults = {
        perspective: 800,
        valuesFromTo: {
            x: [-35, 35],
            y: [-35, 35],
            rx: [-18, 18],
            ry: [-10, 10],
            rz: [-4, 4]
        },
        amt: 0.1
    };

    imgTransforms = {x: 0, y: 0, rx: 0, ry: 0, rz: 0};

    constructor(DOM_el, options) {
        this.DOM.el = DOM_el;
        this.DOM.wrapEl = this.DOM.el.querySelector('.content__img-wrap');
        this.options = Object.assign(this.defaults, options);

        if (this.options.perspective) {
            this.DOM.el.style.perspective = `${this.options.perspective}px`;
        }

        requestAnimationFrame(() => this.render());
    }
    
    render() {
        this.imgTransforms.x = lerp(this.imgTransforms.x, map(cursor.x, 0, winsize.width, this.options.valuesFromTo.x[0], this.options.valuesFromTo.x[1]), this.options.amt);
        this.imgTransforms.y = lerp(this.imgTransforms.y, map(cursor.y, 0, winsize.height, this.options.valuesFromTo.y[0], this.options.valuesFromTo.y[1]), this.options.amt);
        this.imgTransforms.rz = lerp(this.imgTransforms.rz, map(cursor.x, 0, winsize.width, this.options.valuesFromTo.rz[0], this.options.valuesFromTo.rz[1]), this.options.amt);

        this.imgTransforms.rx = !this.options.perspective ? 0 : lerp(this.imgTransforms.rx, map(cursor.y, 0, winsize.height, this.options.valuesFromTo.rx[0], this.options.valuesFromTo.rx[1]), this.options.amt);
        this.imgTransforms.ry = !this.options.perspective ? 0 : lerp(this.imgTransforms.ry, map(cursor.x, 0, winsize.width, this.options.valuesFromTo.ry[0], this.options.valuesFromTo.ry[1]), this.options.amt);
        
        this.DOM.wrapEl.style.transform = `translateX(${this.imgTransforms.x}px) translateY(${this.imgTransforms.y}px) rotateX(${this.imgTransforms.rx}deg) rotateY(${this.imgTransforms.ry}deg) rotateZ(${this.imgTransforms.rz}deg)`;
        
        requestAnimationFrame(() => this.render());
    } 
}

// 全局变量用于 InteractiveTilt
let winsize = calcWinsize();
let cursor = {x: winsize.width/2, y: winsize.height/2};

// 监听窗口大小变化和鼠标移动
window.addEventListener('resize', () => winsize = calcWinsize());
window.addEventListener('mousemove', ev => cursor = getCursorPos(ev));

// 设置默认动画设置
const setupAnimationDefaults = (itemElement, options) => {
    let defaults = {
        clipPaths: {
            step1: {
                initial: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                final: 'polygon(50% 0%, 50% 50%, 50% 50%, 50% 100%)',
            },
            step2: {
                initial: 'polygon(50% 50%, 50% 0%, 50% 100%, 50% 50%)',
                final: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            }
        },
        scrollTrigger: {
            trigger: itemElement,
            start: 'top 50%',
            end: '+=50%',
            scrub: true,
        },
        perspective: false
    };
  
    if (options && options.scrollTrigger) {
        defaults.scrollTrigger = {
            ...defaults.scrollTrigger,
            ...options.scrollTrigger
        };
    }
  
    return {
        ...defaults,
        ...options,
        scrollTrigger: defaults.scrollTrigger
    };
};  

// 准备文本动画
const prepareTextForAnimation = itemElement => {
    const textSpans = itemElement.querySelectorAll('.content__text > span');
  
    // 简单的字符分割（替代 Splitting.js）
    textSpans.forEach(span => {
        const text = span.textContent;
        const chars = text.split('').map(char => 
            char === ' ' ? '<span class="char whitespace"> </span>' : `<span class="char">${char}</span>`
        ).join('');
        span.innerHTML = chars;
    });

    const charsArray = Array.from(textSpans).map(span => {
        return Array.from(span.querySelectorAll('.char'));
    });
  
    charsArray.forEach(charArray => {
        gsap.set(charArray, { opacity: 0 });
    });
    
    return charsArray;
};

// 预加载图片
const preloadImages = (selector) => {
    return new Promise((resolve) => {
        imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
    });
};

// 动画效果函数
const fx1 = (itemElement, options) => {
    const settings = setupAnimationDefaults(itemElement, options);
    const imageElement = itemElement.querySelector('.content__img');
    const innerElements = imageElement.querySelectorAll('.content__img-inner');
    const charsArray = prepareTextForAnimation(itemElement);

    const tl = gsap.timeline({
        defaults: { ease: 'none' },
        onStart: () => {
            if ( settings.perspective ) {
                gsap.set(imageElement, { perspective: settings.perspective });
            }
        },
        scrollTrigger: settings.scrollTrigger
    })
    .fromTo(imageElement, {
        filter: 'brightness(100%)',
        'clip-path': settings.clipPaths.step1.initial
    }, {
        ease: 'sine.in',
        filter: 'brightness(800%)',
        'clip-path': settings.clipPaths.step1.final
    }, 0)
    .to(innerElements[0], {
        ease: 'sine.in',
        rotationY: -40,
        scale: 1.4,
    }, 0)
    .add(() => {
        innerElements[0].classList.toggle('content__img-inner--hidden');
        innerElements[1].classList.toggle('content__img-inner--hidden');
    })
    .to(imageElement, {
        startAt: { 'clip-path': settings.clipPaths.step2.initial },
        'clip-path': settings.clipPaths.step2.final,
        filter: 'brightness(100%)'
    })
    .to(innerElements[1], {
        startAt: {rotationY: 40, scale: 1.4},
        rotationY: 0,
        scale: 1,
    }, '<')
    .addLabel('texts', '<-=0.3');

    charsArray.forEach((charArray, index) => {
        const staggerDirection = index % 2 === 0 ? 1 : -1;

        tl.to(charArray, {
            startAt: {opacity: 1, scale: .2},
            opacity: 1,
            scale: 1,
            yPercent: -staggerDirection*40,
            stagger: staggerDirection*0.04
        }, 'texts');
    });

    return tl;
}

const fx2 = (itemElement, options) => {
    const settings = setupAnimationDefaults(itemElement, options);
    const imageElement = itemElement.querySelector('.content__img');
    const innerElements = imageElement.querySelectorAll('.content__img-inner');
    const charsArray = prepareTextForAnimation(itemElement);

    const tl = gsap.timeline({
        defaults: { ease: 'none' },
        onStart: () => {
            if ( settings.perspective ) {
                gsap.set([imageElement, itemElement], { perspective: settings.perspective });
            }
        },
        scrollTrigger: settings.scrollTrigger
    })
    .fromTo(imageElement, {
        filter: 'brightness(100%) hue-rotate(0deg)',
        'clip-path': settings.clipPaths.step1.initial
    }, {
        filter: 'brightness(800%) hue-rotate(90deg)',
        'clip-path': settings.clipPaths.step1.final
    }, 0)
    .to(innerElements[0], {
        rotationZ: -5,
        scaleX: 1.8,
    }, 0)
    .add(() => {
        innerElements[0].classList.toggle('content__img-inner--hidden');
        innerElements[1].classList.toggle('content__img-inner--hidden');
    })
    .to(imageElement, {
        startAt: { 'clip-path': settings.clipPaths.step2.initial },
        'clip-path': settings.clipPaths.step2.final,
        filter: 'brightness(100%) hue-rotate(0deg)'
    })
    .to(innerElements[1], {
        startAt: {rotationZ: 5, scaleX: 1.8},
        rotationZ: 0,
        scaleX: 1,
    }, '<')
    .addLabel('texts', '<-=0.3');

    charsArray.forEach((charArray, index) => {
        charArray.sort(() => Math.random() - 0.5);
        const staggerDirection = index % 2 === 0 ? 1 : -1;

        tl.to(charArray, {
            duration: 0.1,
            opacity: 1,
            stagger: staggerDirection*0.04
        }, 'texts');
    });

    return tl;
}

const fx3 = (itemElement, options) => {
    const settings = setupAnimationDefaults(itemElement, options);
    const imageElement = itemElement.querySelector('.content__img');
    const innerElements = imageElement.querySelectorAll('.content__img-inner');
    const text = itemElement.querySelector('.content__text');
    
    // 设置初始状态为8.jpg可见，7.jpg隐藏（反向演示）
    gsap.set(innerElements[0], { opacity: 0 });
    gsap.set(innerElements[1], { opacity: 1 });
    
    return gsap.timeline({
        defaults: { ease: 'none' },
        onStart: () => {
            if ( settings.perspective ) {
                gsap.set([imageElement, itemElement], { perspective: settings.perspective });
            }
            // 设置初始状态为8.jpg可见
            gsap.set(innerElements[0], { opacity: 0 });
            gsap.set(innerElements[1], { opacity: 1 });
        },
        scrollTrigger: settings.scrollTrigger
    })
    // 反向演示：从最终状态开始
    .fromTo(imageElement, {
        scale: 1.2,
        filter: 'brightness(60%) contrast(400%) opacity(0%)',
        rotationX: 25,
        rotationY: 2,
        'clip-path': settings.clipPaths.step2.final
    }, {
        ease: 'sine',
        filter: 'brightness(100%) contrast(100%) opacity(100%)',
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        'clip-path': settings.clipPaths.step2.initial
    }, 0)
    .fromTo(innerElements[1], {
        skewY: 0,
        scaleY: 1,
    }, {
        ease: 'sine',
        skewY: 10,
        scaleY: 2,
    }, 0)
    .add(() => {
        // 反向切换：从8.jpg切换到7.jpg
        innerElements[1].classList.add('content__img-inner--hidden');
        innerElements[0].classList.remove('content__img-inner--hidden');
    }, '>')
    .fromTo(imageElement, {
        scale: 0.7,
        filter: 'brightness(60%) contrast(400%)',
        rotationX: -35,
        rotationY: 35,
        'clip-path': settings.clipPaths.step1.final
    }, {
        ease: 'sine.in',
        filter: 'brightness(100%) contrast(100%)',
        scale: 0.3,
        rotationX: 0,
        rotationY: 0,
        'clip-path': settings.clipPaths.step1.initial
    }, '<')
    .fromTo(innerElements[0], {
        skewY: 10,
        scaleY: 1.2,
    }, {
        ease: 'sine.in',
        skewY: 0,
        scaleY: 1,
    }, '<')
    .fromTo(text, {
        opacity: 1,
        yPercent: 0,
    }, {
        opacity: 0,
        yPercent: 40,
    }, '>')
}

const fx4 = (itemElement, options) => {
    const settings = setupAnimationDefaults(itemElement, options);
    const imageElement = itemElement.querySelector('.content__img');
    const innerElements = imageElement.querySelectorAll('.content__img-inner');
    const charsArray = prepareTextForAnimation(itemElement);

    const tl = gsap.timeline({
        defaults: { ease: 'power1.inOut' },
        onStart: () => {
            if ( settings.perspective ) {
                gsap.set([imageElement, itemElement], { perspective: settings.perspective });
            }
        },
        scrollTrigger: settings.scrollTrigger
    })
    .fromTo(imageElement, {
        filter: 'brightness(100%) grayscale(0%)',
        'clip-path': settings.clipPaths.step1.initial
    }, {
        rotationZ: 90,
        scale: 0.6,
        filter: 'brightness(800%) grayscale(100%)',
        'clip-path': settings.clipPaths.step1.final
    }, 0)
    .to(innerElements[0], {
        rotationZ: -5,
        scaleX: 1.4,
    }, 0)
    .add(() => {
        innerElements[0].classList.toggle('content__img-inner--hidden');
        innerElements[1].classList.toggle('content__img-inner--hidden');
    })
    .to(imageElement, {
        startAt: { 'clip-path': settings.clipPaths.step1.final, rotationZ: -90 },
        'clip-path': settings.clipPaths.step2.final,
        filter: 'brightness(100%) grayscale(0%)',
        rotationZ: 0,
        scale: 1,
    })
    .to(innerElements[1], {
        startAt: {rotationZ: -350, scaleX: 1.4},
        rotationZ: -360,
        scaleX: 1,
    }, '<')
    .addLabel('texts', '<-=0.3');

    charsArray.forEach((charArray, index) => {
        const staggerDirection = index % 2 === 0 ? 1 : -1;

        tl.to(charArray, {
            startAt: {opacity: 1, scale: .2},
            opacity: 1,
            scale: 1,
            yPercent: staggerDirection*400,
            stagger: staggerDirection*0.02
        }, 'texts');
    });

    return tl;
}

const fx5 = (itemElement, options) => {
    const settings = setupAnimationDefaults(itemElement, options);
    const imageElement = itemElement.querySelector('.content__img');
    const innerElements = imageElement.querySelectorAll('.content__img-inner');
    const charsArray = prepareTextForAnimation(itemElement);

    const tl = gsap.timeline({
        defaults: { ease: 'back.out(1.5)' },
        onStart: () => {
            if ( settings.perspective ) {
                gsap.set([imageElement, itemElement], { perspective: settings.perspective });
            }
        },
        scrollTrigger: settings.scrollTrigger
    })
    .fromTo(imageElement, {
        filter: 'brightness(100%) saturate(100%)',
        'clip-path': settings.clipPaths.step1.initial
    }, {
        ease: 'back.in(1.5)',
        rotationZ: 90,
        scale: 0.6,
        filter: 'brightness(300%) saturate(200%)',
        'clip-path': settings.clipPaths.step1.final
    }, 0)
    .to(innerElements[0], {
        ease: 'back.in(1.5)',
        scaleX: 1.4,
    }, 0)
    .add(() => {
        innerElements[0].classList.toggle('content__img-inner--hidden');
        innerElements[1].classList.toggle('content__img-inner--hidden');
    })
    .to(imageElement, {
        startAt: { 'clip-path': settings.clipPaths.step1.final, rotationZ: -90 },
        'clip-path': settings.clipPaths.step2.final,
        filter: 'brightness(100%) saturate(100%)',
        rotationZ: 0,
        scale: 1,
    })
    .to(innerElements[1], {
        startAt: {scaleX: 1.4},
        scaleX: 1,
    }, '<')
    .addLabel('texts', '<-=0.3');

    charsArray.forEach((charArray, index) => {
        charArray.sort(() => Math.random() - 0.5);
        const staggerDirection = index % 2 === 0 ? 1 : -1;

        tl.fromTo(charArray, {
            opacity: 1, 
            transformOrigin: `50% ${staggerDirection < 0 ? 100 : 0}%`, 
            scaleY: 0
        }, {
            duration: 0.1,
            ease: 'none',
            scaleY: 1,
            stagger: staggerDirection*0.02
        }, 'texts');
    });

    return tl;
}

const fx6 = (itemElement, options) => {
    const settings = setupAnimationDefaults(itemElement, options);
    const imageElement = itemElement.querySelector('.content__img');
    const inner = imageElement.querySelector('.content__img-inner');
    const charsArray = prepareTextForAnimation(itemElement);

    const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onStart: () => {
            if ( settings.perspective ) {
                gsap.set(imageElement, { perspective: settings.perspective });
            }
        },
        scrollTrigger: settings.scrollTrigger
    })
    .fromTo(imageElement, {
        scale: 0.2,
        filter: 'brightness(50%)',
        'clip-path': settings.clipPaths.step1.initial,
        transformOrigin: '75% 50%'
    }, {
        scale: 1,
        filter: 'brightness(100%)',
        'clip-path': settings.clipPaths.step1.final
    }, 0)
    .fromTo(inner, {
        rotationY: 40,
        scale: 2,
    }, {
        rotationY: 0,
        scale: 1,
    }, 0)

    charsArray.forEach((charArray, index) => {
        const staggerDirection = index % 2 === 0 ? 1 : -1;

        tl.fromTo(charArray, {
            opacity: 0, 
            scale: 1.2
        }, {
            opacity: 1,
            scale: 1,
            yPercent: staggerDirection*100,
            stagger: staggerDirection*-0.02
        }, 0);
    });

    return tl;
}

const fxIntro = (itemElement, options) => {
    const settings = setupAnimationDefaults(itemElement, options);
    const imageElement = itemElement.querySelector('.content__img');
    const inner = imageElement.querySelector('.content__img-inner');
    
    return gsap.timeline({
        defaults: { ease: 'none' },
        onStart: () => {
            if ( settings.perspective ) {
                gsap.set(imageElement, { perspective: settings.perspective });
            }
        },
        scrollTrigger: settings.scrollTrigger
    })
    .fromTo(imageElement, {
        scale: 1,
        xPercent: 0,
        filter: 'brightness(100%)',
        'clip-path': settings.clipPaths.step1.initial
    }, {
        scale: 0.5,
        xPercent: -50,
        'clip-path': settings.clipPaths.step1.final,
        filter: 'brightness(500%)',
    }, 0)
    .to(inner, {
        rotationY: -40,
        scale: 1.4,
    }, 0)
    .to(imageElement, {
        startAt: { 'clip-path': settings.clipPaths.step2.initial },
        scale: 0,
        xPercent: -100,
        'clip-path': settings.clipPaths.step2.final,
        filter: 'brightness(100%)'
    })
    .to(inner, {
        startAt: {rotationY: 40},
        rotationY: 0,
        scale: 1,
    }, '<');
}

const OnScrollShapeMorph = () => {
  const containerRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    // 添加加载状态
    document.body.classList.add('loading');
    
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

      return () => {
        if (lenisRef.current) {
          lenisRef.current.destroy();
        }
      };
    };

    // 应用滚动动画
    const scroll = () => {
      const items = [
        {
          id: '#item-1', 
          animationProfile: fx1,
          interactiveTilt: true,
          options: {
            perspective: 1000
          } 
        },
        {
          id: '#item-2',
          animationProfile: fx2,
          interactiveTilt: true,
          options: {
            clipPaths: {
              step1: {
                initial: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                final: 'polygon(40% 50%, 60% 50%, 80% 50%, 20% 50%)',
              },
              step2: {
                initial: 'polygon(20% 50%, 80% 50%, 60% 50%, 40% 50%)',
                final: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              }
            },
            scrollTrigger: {
              start: 'center bottom',
              end: 'top top'
            },
            perspective: 500
          } 
        },
        {
          id: '#item-3', 
          animationProfile: fx3,
          options: {
            clipPaths: {
              step1: {
                initial: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                final: 'polygon(50% 0%, 50% 50%, 50% 50%, 50% 100%)',
              },
              step2: {
                initial: 'polygon(50% 50%, 50% 0%, 50% 100%, 50% 50%)',
                final: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              }
            },
            scrollTrigger: {
              start: 'center center',
              end: '+=150%',
              pin: true
            },
            perspective: 400
          } 
        },
        {
          id: '#item-4',
          animationProfile: fx4,
          interactiveTilt: true,
          options: {
            clipPaths: {
              step1: {
                initial: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                final: 'polygon(40% 50%, 60% 50%, 80% 50%, 20% 50%)',
              },
              step2: {
                initial: 'polygon(20% 50%, 80% 50%, 60% 50%, 40% 50%)',
                final: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              }
            },
            scrollTrigger: {
              start: 'center bottom',
              end: 'top top-=10%'
            },
            perspective: 500
          } 
        },
        {
          id: '#item-5',
          animationProfile: fx5,
          interactiveTilt: true,
          options: {
            clipPaths: {
              step1: {
                initial: 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
                final: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)',
              },
              step2: {
                initial: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)',
                final: 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
              }
            },
            scrollTrigger: {
              start: 'top bottom+=20%',
              end: 'bottom top'
            },
            perspective: 500
          } 
        },
        {
          id: '#item-6', 
          animationProfile: fx6,
          interactiveTilt: true,
          options: {
            clipPaths: {
              step1: {
                initial: 'polygon(50% 0%, 50% 50%, 50% 50%, 50% 100%)',
                final: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              },
            },
            scrollTrigger: {
              start: 'center bottom',
              end: '+=80%'
            },
            perspective: 1000
          } 
        },
        {
          id: '#item-intro', 
          animationProfile: fxIntro,
          interactiveTilt: true,
          options: {
            scrollTrigger: {
              start: 'clamp(top bottom)',
              end: 'center top'
            },
            perspective: 1000
          } 
        },
      ];

      items.forEach(item => {
        const itemElement = document.querySelector(item.id);
        if ( itemElement && item.animationProfile ) {
          item.animationProfile(itemElement, item.options);

          if ( item.interactiveTilt ) {
            new InteractiveTilt(itemElement);
          }
        } else {
          console.warn(`Element with ID ${item.id} or its animation profile is not defined.`);
        }
      });
    }

    // 完整的初始化
    const init = async () => {
      try {
        await preloadImages('.content__img-inner');
        document.body.classList.remove('loading');
        
        // 初始化平滑滚动
        initSmoothScrolling();
        
        // 确保 DOM 完全渲染后应用滚动动画
        requestAnimationFrame(() => {
          scroll();
        });
      } catch (error) {
        console.error('初始化失败:', error);
        document.body.classList.remove('loading');
        initSmoothScrolling();
        requestAnimationFrame(() => {
          scroll();
        });
      }
    };

    init();

    // 清理函数
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="onscroll-shape-morph" ref={containerRef}>
      {/* 介绍部分 */}
      <div className="intro">
        <div id="item-intro" className="content content--intro">
          <div className="content__img-wrap">
            <div className="content__img content__img--1">
              <div className="content__img-inner" style={{ backgroundImage: 'url(/img/17.jpg)' }}></div>
            </div>
          </div>
        </div>
        <h1 className="intro__title"> 
          <span className="intro__title-pre">Xtynct</span> 
        </h1> 
        <span className="intro__info">Scroll moderately for a better animation experience.</span> 
      </div>
      
      <div className="content-wrap">
        <div id="item-1" className="content">
          <div className="content__img-wrap">
            <div className="content__img content__img--1">
              <div className="content__img-inner" style={{ backgroundImage: 'url(/img/4.jpg)' }}></div>
              <div className="content__img-inner content__img-inner--hidden" style={{ backgroundImage: 'url(/img/3.jpg)' }}></div>
            </div>
          </div>
          <p className="content__text content__text--center content__text--large">
            <span>Obey the silence</span>
            <span>Rebel in shadows</span>
          </p>
        </div>
        <div id="item-2" className="content">
          <div className="content__img-wrap">
            <div className="content__img content__img--1">
              <div className="content__img-inner" style={{ backgroundImage: 'url(/img/5.jpg)' }}></div>
              <div className="content__img-inner content__img-inner--hidden" style={{ backgroundImage: 'url(/img/6.jpg)' }}></div>
            </div>
          </div>
          <p className="content__text content__text--left">
            <span>From Thrones to Chains</span> 
            <span>Surrender of Sovereignty</span>
          </p>
        </div>
        <div id="item-3" className="content">
          <div className="content__img-wrap">
            <div className="content__img content__img--2">
              <div className="content__img-inner" style={{ backgroundImage: 'url(/img/7.jpg)' }}></div>
              <div className="content__img-inner content__img-inner--hidden" style={{ backgroundImage: 'url(/img/8.jpg)' }}></div>
            </div>
          </div>
          <p className="content__text content__text--left">
            <span>You make me dream </span>
            <span>Your dreams</span> 
            <span className="content__text-tiny">
              Do you ever dream of a dream so real it makes you question reality? What is reality? Do you question it? Turn off the light switch. Does it turn off? Question right now: is it a dream? You always wake up once you realize it's a dream. So, don't wake up. Realize it's a dream. That's how you enter the real world.
            </span>
          </p>
        </div>
        <div id="item-4" className="content">
          <div className="content__img-wrap">
            <div className="content__img content__img--4">
              <div className="content__img-inner" style={{ backgroundImage: 'url(/img/9.jpg)' }}></div>
              <div className="content__img-inner content__img-inner--hidden" style={{ backgroundImage: 'url(/img/10.jpg)' }}></div>
            </div>
          </div>
          <p className="content__text content__text--center">
            <span>Your Willingness is</span> 
            <span>Collective Triumph</span>
          </p>
        </div>
        <div id="item-5" className="content">
          <div className="content__img-wrap">
            <div className="content__img content__img--5">
              <div className="content__img-inner" style={{ backgroundImage: 'url(/img/16.jpg)' }}></div>
              <div className="content__img-inner content__img-inner--hidden" style={{ backgroundImage: 'url(/img/15.jpg)' }}></div>
            </div>
          </div>
          <p className="content__text content__text--left">
            <span>Controlling my feelings</span> 
            <span>for too long</span>
          </p>
        </div>
        <div id="item-6" className="content">
          <div className="content__img-wrap">
            <div className="content__img content__img--6">
              <div className="content__img-inner" style={{ backgroundImage: 'url(/img/17.jpg)' }}></div>
            </div>
          </div>
          <p className="content__text content__text--center">
            <span>You were never truly loved</span> 
            <span>You have only been betrayed</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnScrollShapeMorph;
