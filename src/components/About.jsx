import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import BayerDitheringBackground from "./BayerDitheringBackground";

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger);

// 工具函数
const lerp = (a, b, n) => (1 - n) * a + n * b;
const getCursorPos = (ev) => {
  return {
    x: ev.clientX,
    y: ev.clientY
  };
};
const map = (value, inMin, inMax, outMin, outMax) => {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};
const calcWinsize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
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
      x: [-15, 15],
      y: [-15, 15],
      rx: [-8, 8],
      ry: [-4, 4],
      rz: [-2, 2]
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
    
    if (this.DOM.wrapEl) {
      this.DOM.wrapEl.style.transform = `translateX(${this.imgTransforms.x}px) translateY(${this.imgTransforms.y}px) rotateX(${this.imgTransforms.rx}deg) rotateY(${this.imgTransforms.ry}deg) rotateZ(${this.imgTransforms.rz}deg)`;
    }
    
    requestAnimationFrame(() => this.render());
  }
}

// Global variables for InteractiveTilt
let winsize = calcWinsize();
let cursor = {x: winsize.width/2, y: winsize.height/2};

const About = () => {
  const itemRef = useRef(null);
  const interactiveTiltRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      winsize = calcWinsize();
    };
    const handleMouseMove = (ev) => {
      cursor = getCursorPos(ev);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (interactiveTiltRef.current) {
        interactiveTiltRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const itemElement = itemRef.current;
    if (!itemElement) return;

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

    const prepareTextForAnimation = (itemElement) => {
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

    // fx1 动画 - 4.jpg的完整实现
    const fx1 = (itemElement, options) => {
      const settings = setupAnimationDefaults(itemElement, options);
      const imageElement = itemElement.querySelector('.content__img');
      const innerElements = imageElement.querySelectorAll('.content__img-inner');
      const charsArray = prepareTextForAnimation(itemElement);

      // 重置初始状态
      gsap.set(imageElement, { 
        filter: 'brightness(100%)',
        'clip-path': settings.clipPaths.step1.initial,
        perspective: settings.perspective
      });
      gsap.set(innerElements[0], { rotationY: 0, scale: 1 });
      gsap.set(innerElements[1], { rotationY: 0, scale: 1 });
      
      // 确保正确的初始可见性
      innerElements[0].classList.remove('content__img-inner--hidden');
      innerElements[1].classList.add('content__img-inner--hidden');

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          ...settings.scrollTrigger,
          refreshPriority: -1,
          invalidateOnRefresh: true,
          onEnter: () => {
            // 进入动画区域时确保正确状态
            innerElements[0].classList.remove('content__img-inner--hidden');
            innerElements[1].classList.add('content__img-inner--hidden');
          },
          onLeave: () => {
            // 离开动画区域时重置到初始状态
            gsap.set(imageElement, { 
              filter: 'brightness(100%)',
              'clip-path': settings.clipPaths.step1.initial
            });
            gsap.set(innerElements[0], { rotationY: 0, scale: 1 });
            gsap.set(innerElements[1], { rotationY: 0, scale: 1 });
            innerElements[0].classList.remove('content__img-inner--hidden');
            innerElements[1].classList.add('content__img-inner--hidden');
          },
          onEnterBack: () => {
            // 从下方返回时重置状态
            gsap.set(imageElement, { 
              filter: 'brightness(100%)',
              'clip-path': settings.clipPaths.step1.initial
            });
            gsap.set(innerElements[0], { rotationY: 0, scale: 1 });
            gsap.set(innerElements[1], { rotationY: 0, scale: 1 });
            innerElements[0].classList.remove('content__img-inner--hidden');
            innerElements[1].classList.add('content__img-inner--hidden');
          }
        }
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
    };

    const options = {
      perspective: 1000
    };

    fx1(itemElement, options);

    if (!interactiveTiltRef.current) {
      interactiveTiltRef.current = new InteractiveTilt(itemElement, {
        perspective: 1000,
        valuesFromTo: {
          x: [-8, 8],
          y: [-6, 6],
          rx: [-6, 6],
          ry: [-3, 3],
          rz: [-1.5, 1.5]
        },
        amt: 0.08
      });
    }

    return () => {
      // 清理所有 ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === itemElement) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div id="about" className="wrapper relative w-full min-h-[60vh] md:min-h-dvh pt-16 md:pt-0">
      <BayerDitheringBackground 
        shape="diamond" 
        pixelSize={3} 
        color="#5e9cdb"
        className="opacity-100"
        style={{ zIndex: 0 }}
      />
      <div className="content relative w-full overflow-x-hidden">
        <section className="section hero w-full h-screen flex items-center justify-center">
          {/* 完整的OnScrollShapeMorph格式 - 4.jpg实现 */}
          <div 
            ref={itemRef}
            id="item-1" 
            className="content onscroll-shape-morph"
            style={{
              flex: 'none',
              display: 'grid',
              placeItems: 'center',
              lineHeight: '1.2',
              gridTemplateAreas: "'title' 'layout' '...'",
              gridTemplateRows: '3.5vw auto 3.5vw',
              gap: '1rem',
              height: '100%',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div className="content__img-wrap" style={{
              gridArea: 'layout',
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'grid',
              placeItems: 'center',
              overflow: 'hidden'
            }}>
              <div
                className="content__img content__img--1"
                style={{
                  '--img-width': '70vw',
                  '--img-height': 'auto',
                  '--img-ar': '16/8',
                  '--img-inner-margin-x': '0px',
                  '--img-inner-margin-y': '0px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'grid',
                  placeItems: 'center',
                  width: 'var(--img-width)',
                  height: 'var(--img-height)',
                  aspectRatio: 'var(--img-ar)'
                }}
              >
                <div
                  className="content__img-inner"
                  style={{
                    backgroundImage: 'url(/img/4.jpg)',
                    gridArea: '1 / -1',
                    width: 'calc(100% + var(--img-inner-margin-x) * 2)',
                    height: 'calc(100% + var(--img-inner-margin-y) * 2)',
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 50%',
                    borderRadius: '1rem'
                  }}
                />
                <div
                  className="content__img-inner content__img-inner--hidden"
                  style={{
                    backgroundImage: 'url(/img/3.jpg)',
                    gridArea: '1 / -1',
                    width: 'calc(100% + var(--img-inner-margin-x) * 2)',
                    height: 'calc(100% + var(--img-inner-margin-y) * 2)',
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 50%',
                    borderRadius: '1rem'
                  }}
                />
              </div>
            </div>
            <p className="content__text content__text--center content__text--large" style={{
              gridArea: 'title',
              fontFamily: "'AlphaLyrae', sans-serif",
              position: 'relative',
              zIndex: 100,
              textTransform: 'uppercase',
              fontSize: 'clamp(1.2rem, 4vw, 3rem)',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              fontWeight: 400,
              lineHeight: 0.8,
              textAlign: 'center',
              alignSelf: 'stretch',
              justifyContent: 'space-between',
              gridRow: '1 / span 3',
              padding: '10vh 0'
            }}>
              <span data-splitting>Obey the silence</span>
              <span data-splitting>Rebel in shadows</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;