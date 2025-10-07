import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState, useContext } from "react";
import { isMobileDevice } from '../utils/deviceDetection';
import { WebGPUCanvas } from "./WebGPUCanvas";
import { PostProcessing } from "./PostProcessing";
import ScanningEffectScene from "./ScanningEffectScene";
import { ScanningContext } from "../context/ScanningContext";

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

// 全局变量用于 InteractiveTilt
let winsize = calcWinsize();
let cursor = {x: winsize.width/2, y: winsize.height/2};

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const { isLoading, setIsLoading } = useContext(ScanningContext);
  const interactiveTiltRef = useRef(null);

  // 设置加载完成 - 减少加载时间
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setIsLoading(false);
    }, 500); // 0.5秒后完成加载，减少等待时间

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  // 初始化鼠标交互和窗口大小监听
  useEffect(() => {
    // 监听窗口大小变化和鼠标移动
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

  // 清理InteractiveTilt实例
  useEffect(() => {
    return () => {
      if (interactiveTiltRef.current) {
        interactiveTiltRef.current = null;
      }
    };
  }, []);


  // 移除视频相关的GSAP动画

  useGSAP(() => {
    // 检测是否为移动设备
    const isMobile = isMobileDevice();
    
    // 为扫描背景添加鼠标晃动效果
    const scanningElement = document.querySelector("#scanning-background");
    
    if (scanningElement && !isMobile && !interactiveTiltRef.current) {
      console.log('Initializing InteractiveTilt for scanning background');
      console.log('scanningElement:', scanningElement);
      console.log('wrapEl:', scanningElement.querySelector('.content__img-wrap'));
      
      interactiveTiltRef.current = new InteractiveTilt(scanningElement, {
        perspective: 800,
        valuesFromTo: {
          x: [-10, 10],
          y: [-10, 10],
          rx: [-5, 5],
          ry: [-3, 3],
          rz: [-1, 1]
        },
        amt: 0.08
      });
    }
  });

  // 移除getVideoSrc函数，因为不再使用视频

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          {/* https://uiverse.io/G4b413l/tidy-walrus-92 */}
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg"
      >
        <div className="relative w-full h-full">
          {/* 全屏WebGPU扫描效果背景 - 带悬浮效果 */}
          <div 
            id="scanning-background"
            className="absolute inset-0 w-full h-full"
            style={{
              width: "90%",
              height: "85%",
              left: "5%",
              top: "12.5%",
              borderRadius: "20px",
              overflow: "hidden"
            }}
          >
            <div 
              className="content__img-wrap w-full h-full"
              style={{
                transformStyle: 'preserve-3d'
              }}
            >
              <WebGPUCanvas 
                className="w-full h-full"
                style={{ 
                  width: '110%', 
                  height: '110%',
                  objectFit: 'cover',
                  willChange: 'transform',
                  transform: 'translateZ(0) translate(-5%, -5%)'
                }}
              >
                <PostProcessing />
                <ScanningEffectScene />
              </WebGPUCanvas>
            </div>
          </div>
        </div>

        {/* OnScrollShapeMorph风格的英文设计 */}
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center">
          <h1 className="intro__title text-white mb-4"> 
            <span className="intro__title-pre text-6xl md:text-8xl font-bold tracking-wider">Xtynct</span> 
          </h1> 
          <span className="intro__info text-white/70 text-sm md:text-base tracking-widest uppercase">
            Scroll moderately for a better animation experience.
          </span>
        </div>
      </div>
    </div>

  );
};

export default Hero;
