import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} />
  </div>
);

const Contact = () => {
  return (
    <div id="contact" className="my-20 min-h-96 w-screen  px-10">
      <div className="relative rounded-lg bg-black py-24 text-blue-50 sm:overflow-hidden">
        {/* 移除所有背景图片 */}

        <div className="flex flex-col items-center text-center">
          <p className="mb-10 font-general text-sm uppercase">
            加入技术未来
          </p>

          <AnimatedTitle
            title="让我们<b>建</b>设 <br /> AIOT创新的 <br /> 新时代"
            className="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
          />

          <div className="flex flex-col items-center gap-4 mt-10">
            {/* 动态箭头指向二维码 */}
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-white animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 13l5 5m0 0l5-5m-5 5V6"
                />
              </svg>
              <div className="flex space-x-1 ml-2">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>

            {/* 二维码图片框 */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white border-2 border-white rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/img/qrcode.png"
                  alt="联系方式二维码"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-white mt-3 text-center font-medium">
                扫码加入我们！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
