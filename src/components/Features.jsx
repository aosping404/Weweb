import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

// 视频组件
export const VideoCard = ({ src, className = "" }) => {
  const videoRef = useRef(null);

  // 判断文件类型
  const isGif = src && src.toLowerCase().includes('.gif');
  const isVideo = src && (
    src.toLowerCase().includes('.mp4') ||
    src.toLowerCase().includes('.webm') ||
    src.toLowerCase().includes('.mov')
  );

  return (
    <BentoTilt className={`relative overflow-hidden rounded-lg ${className}`}>
      <div className="relative size-full">
        {isGif ? (
          <img
            src={src}
            alt=""
            className="absolute left-0 top-0 size-full object-cover object-center"
          />
        ) : isVideo ? (
          <video
            ref={videoRef}
            src={src}
            loop
            muted
            autoPlay
            className="absolute left-0 top-0 size-full object-cover object-center"
          />
        ) : (
          <div className="absolute left-0 top-0 size-full bg-gray-800 flex items-center justify-center">
            <p className="text-white">不支持的文件格式</p>
          </div>
        )}

        {/* 视频悬停效果 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
            </div>
          </div>
        </div>
      </div>
    </BentoTilt>
  );
};

// 文字组件
export const TextCard = ({ title, description, className = "" }) => {
  const textRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(textRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <div ref={textRef} className={`flex flex-col justify-center p-8 md:p-12 ${className}`}>
      <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-lg md:text-xl text-blue-50 opacity-80 leading-relaxed max-w-lg">
          {description}
        </p>
      )}

      {/* 装饰性元素 */}
      <div className="mt-8 flex items-center gap-4">
        <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
        <div className="w-8 h-8 border-2 border-white border-opacity-30 rounded-full flex items-center justify-center">
          <TiLocationArrow className="text-white text-sm" />
        </div>
      </div>
    </div>
  );
};

const Features = () => (
  <section className="bg-black pb-20">
    <div className="container mx-auto px-4 md:px-8">
      {/* 标题区域 */}
      <div className="px-5 py-16">
        <p className="font-circular-web text-2xl md:text-3xl text-blue-50 mb-4">
          丰富资源与竞赛卓越
        </p>
        <p className="max-w-2xl font-circular-web text-lg md:text-xl text-blue-50 opacity-70 leading-relaxed">
          实验室拥有丰富的硬件资源和软件平台，为学生提供从理论学习到项目实践的全方位支持。2024年仅国家级A类竞赛获奖20余项！
        </p>
      </div>

      {/* 第一排：文字在左，视频在右 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <TextCard
          title="大狗-优宝特"
          description="先进的四足机器人技术，具备强大的运动能力和环境适应性，为机器人研究提供重要平台。"
          className="order-2 lg:order-1"
        />
        <VideoCard
          src="/videos/2.mp4"
          className="h-80 md:h-96 order-1 lg:order-2"
        />
      </div>

      {/* 第二排：视频在左，文字在右 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <VideoCard
          src="videos/5.mp4"
          className="h-80 md:h-96 order-1 lg:order-1"
        />
        <TextCard
          title="小狗-德克士"
          description="智能服务机器人，集成了先进的AI算法和人性化交互设计，为现代服务业提供创新解决方案。"
          className="order-2 lg:order-2"
        />
      </div>

      {/* 第三排：文字在左，视频在右 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <TextCard
          title="松灵多模态机器人LIMO"
          description="实现四轮差速型、四轮阿克曼型、履带型、麦克纳姆轮型四种运动模态。"
          className="order-2 lg:order-1"
        />
        <VideoCard
          src="/gif/limo2.gif"
          className="h-80 md:h-96 order-1 lg:order-2"
        />
      </div>

      {/* 第四排：视频在左，文字在右 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <VideoCard
          src="videos/3.mp4"
          className="h-80 md:h-96 order-1 lg:order-1"
        />
        <TextCard
          title="工业机器人"
          description="智能车间核心设备，高精度自动化生产线，为制造业数字化转型提供强有力的技术支撑。"
          className="order-2 lg:order-2"
        />
      </div>

      {/* 底部体验卡片 */}
      <div className="mt-20">
        <BentoTilt className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600">
          <div className="flex size-full flex-col justify-center items-center p-8 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              还有更多在等着你体验！
            </h1>
            <p className="text-lg md:text-xl text-white opacity-90 mb-8 max-w-2xl">
              加入我们，探索更多前沿技术，开启你的创新之旅
            </p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-1 bg-white"></div>
              <TiLocationArrow className="text-white text-2xl" />
              <div className="w-16 h-1 bg-white"></div>
            </div>
          </div>
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;
