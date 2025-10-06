import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

const AnimatedTitle = ({ title, containerClass }) => {
  const containerRef = useRef(null);

  // 检测是否为中文文本
  const isChinese = (text) => {
    return /[\u4e00-\u9fff]/.test(text);
  };

  // 处理文本分割
  const processText = (text) => {
    if (isChinese(text)) {
      // 中文按字符分割，但保持标点符号和字符在一起
      return text.split('').map((char, index) => {
        // 如果是标点符号，与前一个字符合并
        if (/[，。！？；：""''（）【】]/.test(char)) {
          return null; // 标记为需要合并
        }
        return char;
      }).filter((char, index, arr) => {
        // 过滤掉需要合并的字符，但保留标点符号
        if (char === null) return false;
        return true;
      });
    } else {
      // 英文按空格分割
      return text.split(" ");
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "100 bottom",
          end: "center bottom",
          toggleActions: "play none none reverse",
        },
      });

      titleAnimation.to(
        ".animated-word",
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)",
          ease: "power2.inOut",
          stagger: 0.02,
        },
        0
      );
    }, containerRef);

    return () => ctx.revert(); // Clean up on unmount
  }, []);

  return (
    <div ref={containerRef} className={clsx("animated-title", containerClass)}>
      {title.split("<br />").map((line, index) => (
        <div
          key={index}
          className={`flex-center max-w-full flex-wrap ${isChinese(line) ? 'gap-1 md:gap-2' : 'gap-2 md:gap-3'}`}
        >
          {processText(line).map((word, idx) => (
            <span
              key={idx}
              className="animated-word"
              dangerouslySetInnerHTML={{ __html: word }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTitle;
