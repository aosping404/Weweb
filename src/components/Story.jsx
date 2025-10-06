import AnimatedTitle from "./AnimatedTitle";
import BayerDitheringBackground from "./BayerDitheringBackground";
import { useState, useEffect } from "react";

const FloatingImage = () => {
  // 友谊文案数组
  const friendshipQuotes = [
    {
      english: "The most important thing in life will always be the people in this room, right here, right now. You'll always be with me. And you'll always be my brother.",
      chinese: "我们生命中最重要的东西就是这屋檐下的人，就在此时，就在此地，你永远在我身边，也永远是我的兄弟！",
      source: "——Fast & Furious 7"
    },
    {
      english: "There is nothing more important than friendships that endure, especially in a world that insists on changing.",
      chinese: "没有什么比经久不衰的友谊更重要，尤其是在这个不停变化的世界里。",
      source: "——Desperate Housewives"
    },
    {
      english: "Boyfriends and girlfriends come and go, but this (friendship) is for life！",
      chinese: "恋人来来去去，但朋友永远是朋友！",
      source: "——Friends"
    },
    {
      english: "No matter what happens, I'm glad I came with you.",
      chinese: "不管我们现今身处何境，我都不后悔跟你走这一遭。",
      source: "——Thelma and Louise"
    },
    {
      english: "There are more important things: friendship and bravery.",
      chinese: "还有更重要的东西：那就是友谊和勇气。",
      source: "——Harry Potter and the Sorcerer's Stone"
    },
    {
      english: "If you ever find yourself stuck in the middle of the sea, I'll sail the world to find you.",
      chinese: "如果你发现自己被困在海中，我会航遍全世界找到你。",
      source: "——歌曲 Count on Me"
    },
    {
      english: "We were two, Now we are one, And one moment in time, Is all the time we need",
      chinese: "我们曾是孤自的两个人，现在我们两人同心，一个及时的瞬间，就是我们所求的永远。",
      source: "——歌曲 We Are One"
    },
    {
      english: "Melody never say good-bye, I'll be near you",
      chinese: "这旋律将永伴你我，我会在你身边。",
      source: "——歌曲 Forever Friends"
    },
    {
      english: "A little faith brightens a rainy day, Life is difficult you can't go away, Don't hide yourselves in the corner, You have my place to stay",
      chinese: "小小的信念照亮那下雨天，生活是困难的你总不能逃避，不要躲于角落，我的胸怀可让你倚靠。",
      source: "——歌曲 Shining Friends"
    },
    {
      english: "All my best memories come back clearly to me, Some can even make me cry, Just like before, It's yesterday once more",
      chinese: "我所有美好的记忆清晰地重现，有一些仍能使我哭出来，正如从前一样，仿佛昔日又重来。",
      source: "——歌曲 Yesterday Once More"
    }
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [displayQuote, setDisplayQuote] = useState(friendshipQuotes[0]);

  // 随机切换文案
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * friendshipQuotes.length);
      setCurrentQuoteIndex(randomIndex);
      setDisplayQuote(friendshipQuotes[randomIndex]);
    }, 8000); // 每5秒切换一次

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="story" className="min-h-dvh w-screen bg-[#0a0a0f] text-[#5e9cdb] relative">
      <BayerDitheringBackground 
        shape="diamond" 
        pixelSize={3} 
        color="#5e9cdb"
        className="opacity-60"
      />
      <div className="flex size-full flex-col items-center py-6 md:py-10 pb-16 md:pb-24 relative z-30">
        <div className="relative size-full flex flex-col items-center justify-center">

          {/* 友谊文案展示区域 */}
          <div className="flex items-center justify-center mt-6 md:mt-10">
            <div className="w-full max-w-4xl h-[60vh] md:h-[70vh] bg-transparent flex flex-col items-center justify-center">
              {/* 英文文案 */}
              <div className="mb-8 md:mb-12 w-full px-4 md:px-0">
                <div className="text-center text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium leading-relaxed">
                  {displayQuote.english.split(' ').map((word, wordIndex) => (
                    <span key={wordIndex} className="inline-block mr-2 md:mr-3">
                      {word.split('').map((char, charIndex) => (
                        <span
                          key={charIndex}
                          className="inline-block hover:text-[#8bb3e8] transition-colors duration-300 cursor-pointer"
                          style={{
                            animationDelay: `${(wordIndex * 5 + charIndex) * 0.05}s`,
                            animation: 'fadeInUp 0.6s ease-out forwards',
                            opacity: 0,
                            transform: 'translateY(20px)'
                          }}
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 中文文案 */}
              <div className="mb-8 md:mb-12 w-full px-4 md:px-0">
                <div className="text-center text-[#8bb3e8] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium leading-relaxed">
                  {displayQuote.chinese.split('').map((char, index) => (
                    <span
                      key={index}
                      className="inline-block hover:text-[#5e9cdb] transition-colors duration-300 cursor-pointer mx-0.5 md:mx-1"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: 'fadeInUp 0.6s ease-out forwards',
                        opacity: 0,
                        transform: 'translateY(20px)'
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 来源 */}
              <div className="w-full px-4 md:px-0">
                <p className="text-center text-[#5e9cdb] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl opacity-80">
                  {displayQuote.source}
                </p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default FloatingImage;
