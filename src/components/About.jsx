import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    // 图片放大动画
    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });

    // 背景模糊动画
    clipAnimation.to("#blur-background", {
      backdropFilter: "blur(20px)",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    }, 0);

    // 文字模糊动画
    clipAnimation.to("#about-text", {
      filter: "blur(10px)",
      opacity: 0.3,
    }, 0);
  });

  return (
    <div id="about" className="min-h-screen w-screen bg-[#ffffff]">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          智能可穿戴技术
        </p>

        <AnimatedTitle
          title="连接物联网的未来"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext" id="about-text">
          <p className="text-gray-800 text-center max-w-4xl">
            "智能可穿戴实验室专注于物联网技术的前沿研究与应用开发，致力于推动物联网与人工智能、边缘计算、嵌入式系统等领域的深度融合。"
          </p>
          <p className="text-gray-500 text-center max-w-4xl mt-4">
            以"以赛促学"为核心，对接企业实践的前沿阵地，跨专业团队并肩攻坚，从赛事冲刺到项目研发全程协作。
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        {/* 背景模糊层 */}
        <div className="absolute inset-0 bg-white backdrop-blur-0 transition-all duration-1000" id="blur-background"></div>

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
