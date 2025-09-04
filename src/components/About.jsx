import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef, useEffect } from "react";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const audioRef = useRef(null);
  const hasPlayedRef = useRef(false);

  // 测试音频是否能正常加载
  useEffect(() => {
    if (audioRef.current) {
      console.log('音频元素已创建');

      // 监听音频加载事件
      audioRef.current.addEventListener('loadeddata', () => {
        console.log('音频数据已加载');
      });

      audioRef.current.addEventListener('error', (e) => {
        console.log('音频加载错误:', e);
      });
    }
  }, []);

  useGSAP(() => {
    // 确保文字初始状态为清晰
    gsap.set("#about-text", {
      filter: "none",
      opacity: 1,
      clearProps: "all"
    });

    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          // 当滚动进度达到90%以上时播放音频（只播放一次）
          if (self.progress > 0.9 && !hasPlayedRef.current) {
            console.log('滚动进度:', self.progress, '准备播放音频');
            hasPlayedRef.current = true;

            if (audioRef.current) {
              audioRef.current.play().then(() => {
                console.log('音频播放成功');
              }).catch(error => {
                console.log('音频播放失败:', error);
              });
            } else {
              console.log('音频元素不存在');
            }
          }
        }
      },
    });

    // 图片放大动画
    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });

    // 文字模糊动画 - 使用fromTo确保起始状态正确
    clipAnimation.fromTo("#about-text",
      {
        filter: "blur(0px)",
        opacity: 1,
      },
      {
        filter: "blur(10px)",
        opacity: 0.3,
      }, 0);
  });

  return (
    <div id="about" className="min-h-screen w-screen bg-[#ffffff]">
      {/* 隐藏的音频元素 */}
      <audio
        ref={audioRef}
        src="/audio/logo.mp3"
        preload="auto"
        className="hidden"
      />

      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[20px]">
          智能可穿戴技术
        </p>

        <AnimatedTitle
          title="连接物联网的未来"
          containerClass="mt-5 !text-black text-center"
        />

        <div
          className="about-subtext"
          id="about-text"
        >
          <p className="text-gray-800 text-center max-w-4xl">
            "智能可穿戴实验室专注于物联网技术的前沿研究与应用开发，致力于推动物联网与人工智能、边缘计算、嵌入式系统等领域的深度融合。"
          </p>
          <p className="text-gray-500 text-center max-w-4xl mt-4">
            以"以赛促学"为核心，对接企业实践的前沿阵地，跨专业团队并肩攻坚，从赛事冲刺到项目研发全程协作。
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image relative z-10">
          <img
            src="img/about.png"
            alt="Background"
            className="absolute left-0 top-0 w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
