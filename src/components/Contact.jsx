import AnimatedTitle from "./AnimatedTitle";
import BayerDitheringBackground from "./BayerDitheringBackground";
import { useState, useEffect } from "react";

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} />
  </div>
);

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const qqGroupNumber = "993056494";

  const handleCopyQQGroup = async () => {
    try {
      await navigator.clipboard.writeText(qqGroupNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒后重置状态
    } catch (err) {
      // 复制失败，静默处理
    }
  };


  return (
    <div id="contact" className="mt-0 min-h-96 w-screen px-10 -mt-20">
      <BayerDitheringBackground 
        shape="diamond" 
        pixelSize={3} 
        color="#5e9cdb"
        className="opacity-100"
        style={{ zIndex: 0 }}
      />
      <div className="relative rounded-lg pt-0 pb-24 text-[#5e9cdb] sm:overflow-hidden">
        {/* 移除所有背景图片 */}


        {/* 联系信息 */}
        <div className="flex flex-col items-center mt-10">
          <div
            className="text-sm text-white text-center font-medium cursor-pointer transition-colors duration-200 flex items-center gap-2"
            style={{ '--hover-color': '#5e9cdb' }}
            onMouseEnter={(e) => e.target.style.color = '#5e9cdb'}
            onMouseLeave={(e) => e.target.style.color = 'white'}
            onClick={handleCopyQQGroup}
            title="点击复制QQ群号"
          >
            <span>联系我: {qqGroupNumber}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          {copied && (
            <p className="text-xs mt-1 animate-pulse" style={{ color: '#5e9cdb' }}>
              已复制到剪贴板！
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
