import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const WaterfallGallery = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [columns, setColumns] = useState(0);
  const [columnHeights, setColumnHeights] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState('all'); // 新增：选中的文件夹
  const [isScanning, setIsScanning] = useState(false); // 新增：扫描状态
  const [screenSize, setScreenSize] = useState('desktop'); // 新增：屏幕尺寸状态
  const [showAll, setShowAll] = useState(false); // 新增：是否显示所有照片
  const [loadedImages, setLoadedImages] = useState(new Set()); // 新增：已加载的图片
  const [showScrollToBottom, setShowScrollToBottom] = useState(false); // 新增：显示滑到底部按钮
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 新增：加载更多状态
  const [preloadedImages, setPreloadedImages] = useState(new Set()); // 新增：预加载的图片
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const scrollToBottomRef = useRef(null);

  // 媒体数据 - 动态扫描 mypub 文件夹
  const [mediaData, setMediaData] = useState([]);

  // 扫描 mypub 文件夹中的媒体文件
  const scanMediaFiles = useCallback(async () => {
    setIsScanning(true);
    try {
      // 根据您提供的文件列表，我们动态生成媒体数据
      // 自动检测文件类型（基于文件扩展名）
      const fileList = [
        'image_01.jpg',
        'image_02.jpg',
        'image_03.jpg',
        'image_04.jpg',
        'image_05.jpg',
        'image_06.jpg',
        'image_07.jpg',
        'image_08.jpg',
        'image_09.jpg',
        'image_10.jpg',
        'image_11.jpg',
        'image_12.jpg',
        'image_13.jpg',
        'image_14.jpg',
        'image_15.jpg',
        'image_16.jpg',
        'image_17.jpg',
        'image_18.jpg',
        'image_19.jpg',
        'image_20.jpg',
        'image_21.jpg',
        'image_22.jpg',
        'image_23.jpg',
        'image_24.jpg',
        'image_25.jpg',
        'image_26.jpg',
        'image_27.jpg',
        'image_28.jpg',
        'image_29.png',
        'image_30.jpg',
        'image_31.JPG',
        'image_32.JPG',
        'image_33.jpg',
        'image_34.jpg',
        'image_35.jpg',
      ];
      const scannedFiles = fileList.map((filename, index) => {
        const extension = filename.split('.').pop().toLowerCase();
        const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension);
        const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'].includes(extension);

        if (isVideo) {
          return {
            type: 'video',
            src: `/mypub/${filename}`,
            thumbnail: '/img/play.svg',
            alt: `Video ${index + 1}`,
            folder: 'videos'
          };
        } else if (isImage) {
          return {
            type: 'image',
            src: `/mypub/${filename}`,
            alt: `Image ${index + 1}`,
            folder: 'gallery'
          };
        } else {
          // 未知文件类型，跳过
          return null;
        }
      }).filter(Boolean); // 过滤掉 null 值

      setMediaData(scannedFiles);
      console.log('Scanned media files:', scannedFiles);

      // 显示扫描结果
      const imageCount = scannedFiles.filter(f => f.type === 'image').length;
      const videoCount = scannedFiles.filter(f => f.type === 'video').length;
      console.log(`Found ${imageCount} images and ${videoCount} videos`);

    } catch (error) {
      console.error('Error scanning media files:', error);
      // 如果扫描失败，使用默认数据
      const defaultFiles = [
        { type: 'image', src: '/mypub/1.jpg', alt: 'Image 1', folder: 'gallery' },
        { type: 'image', src: '/mypub/2.jpg', alt: 'Image 2', folder: 'gallery' },
        { type: 'image', src: '/mypub/3.jpg', alt: 'Image 3', folder: 'gallery' },
      ];
      setMediaData(defaultFiles);
    } finally {
      setIsScanning(false);
    }
  }, []);

  // 根据选中的文件夹过滤媒体数据，并限制显示数量
  const filteredMediaData = useMemo(() => {
    let filtered = selectedFolder === 'all' ? mediaData : mediaData.filter(item => item.folder === selectedFolder);

    // 如果未点击"查看更多"，只显示前15张图片
    if (!showAll) {
      filtered = filtered.slice(0, 15);
    }

    return filtered;
  }, [selectedFolder, mediaData, showAll]);

  // 计算每行可容纳的瀑布流块个数
  const calculateColumns = useCallback(() => {
    const width = window.innerWidth;
    const gap = 5; // 块之间的间距：5px

    // 响应式列数计算
    let optimalColumns;

    if (width < 640) {
      // 手机端：1列布局
      optimalColumns = 1;
      setScreenSize('mobile');
    } else if (width < 1024) {
      // 平板端：3列布局
      optimalColumns = 3;
      setScreenSize('tablet');
    } else {
      // 桌面端：3列布局
      optimalColumns = 3;
      setScreenSize('desktop');
    }

    console.log('calculateColumns:', { width, gap, optimalColumns, screenSize: screenSize === 'mobile' ? 'mobile (1列)' : screenSize === 'tablet' ? 'tablet (3列)' : 'desktop (3列)' });

    setColumns(optimalColumns);
    setContainerWidth(width);

    return optimalColumns;
  }, [screenSize]);

  // 获取数组中最小值的索引
  const getMinHeightKey = useCallback((arr, minH) => {
    for (let key in arr) {
      if (arr[key] === minH) {
        return parseInt(key);
      }
    }
    return 0;
  }, []);

  // 瀑布流布局算法：成行元素 + 寻找新增元素追加位置
  const layoutWaterfall = useCallback(() => {
    console.log('layoutWaterfall called:', { columns, itemsCount: itemsRef.current.length });

    if (columns === 0 || itemsRef.current.length === 0) {
      console.log('Early return:', { columns, itemsCount: itemsRef.current.length });
      return;
    }

    const items = itemsRef.current;
    const gap = 5; // 固定间距：5px

    // 根据屏幕尺寸动态计算itemWidth
    const width = window.innerWidth;
    let itemWidth;

    if (width < 640) {
      // 手机端：1列布局，自适应宽度
      const containerPadding = 32; // 左右各16px边距
      itemWidth = Math.floor(width - containerPadding);
    } else if (width < 1024) {
      // 平板端：3列布局，自适应宽度
      const containerPadding = 48; // 左右各24px边距
      itemWidth = Math.floor((width - containerPadding - gap * 2) / 3);
    } else {
      // 桌面端：3列布局，固定宽度
      itemWidth = 420;
    }

    // 确保最小宽度
    itemWidth = Math.max(itemWidth, 280);

    console.log('Layout parameters:', { itemWidth, gap, columns, screenSize });

    // 重置容器样式，保证整体居中
    if (containerRef.current) {
      const totalWidth = columns * itemWidth + (columns - 1) * gap;
      containerRef.current.style.width = `${totalWidth}px`;
      containerRef.current.style.margin = '0 auto';
      console.log('Container styled:', { totalWidth });
    }

    // 初始化列高度数组
    const columnHeights = new Array(columns).fill(0);

    // 遍历所有瀑布流块
    for (let i = 0; i < items.length; i++) {
      // 为每个元素设置绝对定位
      items[i].style.position = 'absolute';

      if (i < columns) {
        // 前columns个元素作为第一行，设置top为0
        items[i].style.top = '0px';
        items[i].style.left = `${i * (itemWidth + gap)}px`;
        // 记录每列的高度
        columnHeights[i] = items[i].offsetHeight;
        console.log(`First row item ${i}:`, { top: '0px', left: `${i * (itemWidth + gap)}px`, height: items[i].offsetHeight });
      } else {
        // 找到高度最低的列
        const minHeight = Math.min(...columnHeights);
        const minColumnIndex = columnHeights.indexOf(minHeight);

        // 设置新元素的位置
        items[i].style.top = `${minHeight + gap}px`;
        items[i].style.left = `${minColumnIndex * (itemWidth + gap)}px`;

        // 更新该列的高度
        columnHeights[minColumnIndex] += items[i].offsetHeight + gap;
        console.log(`Subsequent item ${i}:`, { top: `${minHeight + gap}px`, left: `${minColumnIndex * (itemWidth + gap)}px`, column: minColumnIndex });
      }
    }

    console.log('Final column heights:', columnHeights);
    // 更新列高度状态
    setColumnHeights(columnHeights);
  }, [columns, screenSize]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      const newColumns = calculateColumns();
      // 延迟执行布局，确保DOM更新完成
      setTimeout(() => {
        layoutWaterfall();
      }, 100);
    };

    calculateColumns();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [calculateColumns, layoutWaterfall]);

  // 图片加载完成后重新布局
  const handleImageLoad = useCallback((index, src) => {
    // 标记图片为已加载
    setLoadedImages(prev => new Set([...prev, src]));

    // 延迟执行布局，确保图片尺寸已更新
    setTimeout(() => {
      layoutWaterfall();
    }, 100);
  }, [layoutWaterfall]);

  // 初始化布局
  useEffect(() => {
    if (columns > 0) {
      // 延迟执行布局，确保DOM更新完成
      setTimeout(() => {
        layoutWaterfall();
      }, 100);
    }
  }, [columns, layoutWaterfall]);

  // 组件挂载后立即执行布局
  useEffect(() => {
    if (columns > 0 && itemsRef.current.length > 0) {
      layoutWaterfall();
    }
  }, [columns, layoutWaterfall]);

  // 组件挂载时扫描媒体文件
  useEffect(() => {
    scanMediaFiles();
  }, [scanMediaFiles]);

  // 预加载其余图片
  useEffect(() => {
    if (mediaData.length > 0) {
      // 获取需要预加载的图片（第16张及以后）
      const imagesToPreload = mediaData
        .filter(item => item.type === 'image')
        .slice(15); // 从第16张开始

      // 预加载图片
      imagesToPreload.forEach(item => {
        const img = new Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, item.src]));
        };
        img.onerror = () => {
          console.warn(`Failed to preload image: ${item.src}`);
        };
        img.src = item.src;
      });
    }
  }, [mediaData]);

  // 监听滚动，显示/隐藏滑到底部按钮
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 当滚动超过一定距离时显示滑到底部按钮
      setShowScrollToBottom(scrollTop > windowHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 滑到底部功能
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  // 加载更多功能
  const handleLoadMore = async () => {
    setIsLoadingMore(true);

    // 短暂显示加载动画，然后立即显示内容
    await new Promise(resolve => setTimeout(resolve, 300));

    setShowAll(true);
    setIsLoadingMore(false);
  };

  // 视频点击处理
  const handleVideoClick = (videoSrc) => {
    const videoPlayer = document.createElement('div');
    videoPlayer.className = 'fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center';
    videoPlayer.innerHTML = `
      <div class="relative w-full h-full flex items-center justify-center">
        <button class="absolute top-4 right-4 text-white text-2xl z-10 hover:text-gray-300" onclick="this.parentElement.parentElement.remove()">×</button>
        <video class="max-w-full max-h-full" controls autoplay>
          <source src="${videoSrc}" type="video/mp4">
        </video>
      </div>
    `;

    document.body.appendChild(videoPlayer);

    videoPlayer.addEventListener('click', (e) => {
      if (e.target === videoPlayer) {
        videoPlayer.remove();
      }
    });
  };

  // 图片点击处理
  const handleImageClick = (imageSrc) => {
    const imageViewer = document.createElement('div');
    imageViewer.className = 'fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center';
    imageViewer.innerHTML = `
      <div class="relative w-full h-full flex items-center justify-center">
        <button class="absolute top-4 right-4 text-white text-2xl z-10 hover:text-gray-300" onclick="this.parentElement.parentElement.remove()">×</button>
        <img src="${imageSrc}" class="max-w-full max-h-full object-contain" alt="Full size image">
      </div>
    `;

    document.body.appendChild(imageViewer);

    imageViewer.addEventListener('click', (e) => {
      if (e.target === imageViewer) {
        imageViewer.remove();
      }
    });
  };

  // 计算容器总高度
  const containerHeight = Math.max(...columnHeights, 0);

  return (
    <div className="w-full py-8">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          我们
        </h2>

        {/* 文件夹选择器 */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setSelectedFolder('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectedFolder === 'all'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-white hover:bg-white/20'
                }`}
            >
              全部媒体
            </button>
            <button
              onClick={() => setSelectedFolder('videos')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectedFolder === 'videos'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-white hover:bg-white/20'
                }`}
            >
              视频库
            </button>
            <button
              onClick={() => setSelectedFolder('gallery')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${selectedFolder === 'gallery'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-white hover:bg-white/20'
                }`}
            >
              图片库
            </button>
          </div>
        </div>



        {/* 瀑布流容器 */}
        <div
          ref={containerRef}
          className="relative waterfall-container"
          style={{
            height: `${containerHeight}px`,
            width: '100%'
          }}
        >
          {filteredMediaData.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) {
                  itemsRef.current[index] = el;
                }
              }}
              className="waterfall-item group cursor-pointer overflow-hidden rounded-lg animate-fade-in"
              style={{
                width: screenSize === 'mobile' ? '100%' : '420px',
                animationDelay: `${index * 100}ms`
              }}
            >
              {item.type === 'video' ? (
                <div
                  className="relative w-full bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                  onClick={() => handleVideoClick(item.src)}
                  style={{ height: '240px' }}
                >
                  <video
                    src={item.src}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => e.target.pause()}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <img
                      src={item.thumbnail}
                      alt="play"
                      className="w-16 h-16 text-white"
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="relative w-full bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                  onClick={() => handleImageClick(item.src)}
                >
                  {!loadedImages.has(item.src) && !preloadedImages.has(item.src) && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={item.src}
                    alt={item.alt}
                    className={`w-full h-auto object-cover transition-opacity duration-300 ${loadedImages.has(item.src) || preloadedImages.has(item.src) ? 'opacity-100' : 'opacity-0'
                      }`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(index, item.src)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 查看更多按钮 */}
        {!showAll && mediaData.length > 15 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg flex items-center gap-2 ${isLoadingMore
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-100'
                }`}
            >
              {isLoadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                  加载中...
                </>
              ) : (
                `查看更多 (${mediaData.length - 15} 张)`
              )}
            </button>
          </div>
        )}

        {/* 滑到底部按钮 */}
        {showScrollToBottom && (
          <button
            ref={scrollToBottomRef}
            onClick={scrollToBottom}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-white text-black rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default WaterfallGallery;
