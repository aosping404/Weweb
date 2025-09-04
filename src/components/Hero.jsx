import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import VideoPreview from "./VideoPreview";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [loading, setLoading] = useState(true);

  // 直接设置加载完成，因为现在使用GIF而不是视频
  useEffect(() => {
    // 设置一个短暂的延迟来显示加载动画，然后立即完成加载
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1秒后完成加载

    return () => clearTimeout(timer);
  }, []);

  // 移除视频相关的GSAP动画，因为现在使用GIF

  useGSAP(() => {
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
  });

  // 移除getVideoSrc函数，因为不再使用视频

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden bg-[#ffffff]">
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
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg "
      >
        <div>
          {/* 背景纯色填充 */}
          <div className="absolute left-0 top-0 size-full bg-[#000000]"></div>

          {/* 居中的GIF，2倍尺寸显示 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <img
              src="/gif/main.gif"
              alt="Main Animation"
              className="w-[768px] h-[768px] object-contain"
            />
          </div>

          {/* 移除所有视频元素，完全使用GIF和颜色填充 */}
        </div>

        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-[#5e9cdb]">
          滚动
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-[#5e9cdb]">
              智能可穿戴实验室
            </h1>

            <p className="mb-5 max-w-96 font-robert-regular text-white">
              <br />
            </p>

            <Button
              id="lianjie"
              title="现在招新中！"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-gray-500 flex-center gap-1 scale-[1.3] transform border-2 border-white"
              onClick={() => window.open('https://incredible-marzipan-055ab6.netlify.app/', '_blank')}
            />
          </div>
        </div>


      </div>

      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-gray-700">
        滚动
      </h1>
    </div>

  );
};

export default Hero;
