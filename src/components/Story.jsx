import AnimatedTitle from "./AnimatedTitle";
import WaterfallGallery from "./WaterfallGallery";

const FloatingImage = () => {
  return (
    <div id="story" className="min-h-dvh w-screen bg-black text-blue-50">
      <div className="flex size-full flex-col items-center py-10 pb-24">
        <p className="font-general text-sm uppercase md:text-[20px]">
          项目实践与创新
        </p>

        <div className="relative size-full flex flex-col items-center justify-center">
          <AnimatedTitle
            title="体验前沿AIOT技术"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10"
          />

          {/* 简化的居中图片 */}
          <div className="flex items-center justify-center mt-10">
            <img
              src="/img/entrance.gif"
              alt="entrance.gif"
              className="max-w-full max-h-[60vh] object-contain"
            />
          </div>
        </div>

        {/* 瀑布流媒体库 */}
        <div className="mt-20 w-full">
          <WaterfallGallery />
        </div>
      </div>
    </div>
  );
};

export default FloatingImage;
