import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState, useContext } from "react";
import { WebGPUCanvas } from "./WebGPUCanvas";
import { PostProcessing } from "./PostProcessing";
import ScanningEffectScene from "./ScanningEffectScene";
import { ScanningContext } from "../context/ScanningContext";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const { isLoading, setIsLoading } = useContext(ScanningContext);

  // 设置加载完成 - 减少加载时间
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setIsLoading(false);
    }, 500); // 0.5秒后完成加载，减少等待时间

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  // 移除视频相关的GSAP动画，因为现在使用GIF

  useGSAP(() => {
    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // 移动端使用更简单的动画，减少性能消耗
      gsap.set("#video-frame", {
        clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
        borderRadius: "0% 0% 40% 10%",
      });
      gsap.from("#video-frame", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        borderRadius: "0% 0% 0% 0%",
        ease: "power2.out",
        duration: 1.5,
        scrollTrigger: {
          trigger: "#video-frame",
          start: "center center",
          end: "bottom center",
          scrub: 0.5, // 减少scrub值，提高流畅度
          invalidateOnRefresh: true,
        },
      });
    } else {
      // 桌面端使用原有动画
      gsap.set("#video-frame", {
        clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
        borderRadius: "0% 0% 40% 10%",
      });
      gsap.from("#video-frame", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        borderRadius: "0% 0% 0% 0%",
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#video-frame",
          start: "center center",
          end: "bottom center",
          scrub: true,
        },
      });
    }
  });

  // 移除getVideoSrc函数，因为不再使用视频

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden bg-[#0a0a0f]">
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
          {/* 扫描效果背景 - 响应式设计 */}
          <div className="absolute inset-0 w-full h-full">
            <WebGPUCanvas 
              className="w-full h-full"
              style={{ 
                width: '100%', 
                height: '100%',
                objectFit: 'cover',
                willChange: 'transform',
                transform: 'translateZ(0)'
              }}
            >
              <PostProcessing />
              <ScanningEffectScene />
            </WebGPUCanvas>
          </div>
        </div>

        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-[#5e9cdb]">
          <span className="animate-pulse">往</span>
          <span className="animate-pulse" style={{animationDelay: '0.2s'}}>前</span>
          <span className="animate-pulse" style={{animationDelay: '0.4s'}}>•</span>
          <span className="animate-pulse" style={{animationDelay: '0.6s'}}>走</span>
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-[#5e9cdb]">
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">这</span>
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">个</span>
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">世</span>
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">界</span>
              <span className="mx-2 text-[#8bb3e8]">•</span>
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">太</span>
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">吵</span>
            </h1>

            <h2 className="mb-5 max-w-4xl special-font text-2xl md:text-4xl lg:text-5xl text-white font-bold leading-relaxed">
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">别</span>
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">听</span>
              <span className="mx-2 text-[#8bb3e8]">•</span>
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">别</span>
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">看</span>
              <span className="mx-2 text-[#8bb3e8]">•</span>
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">别</span>
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">管</span>
              <span className="mx-2 text-[#8bb3e8]">•</span>
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">然</span>
              <span className="hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer touch-manipulation">后</span>
            </h2>

          </div>
        </div>


      </div>

      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-white">
        <span className="animate-pulse">往</span>
        <span className="animate-pulse" style={{animationDelay: '0.2s'}}>前</span>
        <span className="animate-pulse" style={{animationDelay: '0.4s'}}>•</span>
        <span className="animate-pulse" style={{animationDelay: '0.6s'}}>走</span>
      </h1>
    </div>

  );
};

export default Hero;
