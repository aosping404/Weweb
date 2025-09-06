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
  const [highResImages, setHighResImages] = useState(new Set()); // 新增：已加载高清图片
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, width: 0, height: 0 }); // 新增：按钮位置信息
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const scrollToBottomRef = useRef(null);
  const loadMoreButtonRef = useRef(null); // 新增：加载更多按钮的ref

  // 媒体数据 - 动态扫描 mypub 文件夹
  const [mediaData, setMediaData] = useState([]);

  // 扫描 mypub 文件夹中的媒体文件
  const scanMediaFiles = useCallback(async () => {
    setIsScanning(true);
    try {
      // 根据您提供的文件列表，我们动态生成媒体数据
      // 自动检测文件类型（基于文件扩展名）
      // 动态扫描文件列表 - 根据实际文件生成
      // 运行 rename_files.py 后会生成正确的文件列表
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
        'image_28.png',
        'image_29.jpg',
        'image_30.jpg',
        'image_31.JPG',
        'image_32.JPG',
        'image_33.jpg',
        'image_34.jpg',
        'image_35.jpg',
        'image_36.jpg',
        'image_37.jpg',
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
            src: `/mypub/${filename}`, // 高清原图
            thumbnail: `/mypub/thumbnails/${filename}`, // 缩略图
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
      // 平板端：2列布局
      optimalColumns = 2;
      setScreenSize('tablet');
    } else {
      // 桌面端：3列布局
      optimalColumns = 3;
      setScreenSize('desktop');
    }

    console.log('calculateColumns:', { width, gap, optimalColumns, screenSize: screenSize === 'mobile' ? 'mobile (1列)' : screenSize === 'tablet' ? 'tablet (2列)' : 'desktop (3列)' });

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
      // 平板端：2列布局，自适应宽度
      const containerPadding = 48; // 左右各24px边距
      itemWidth = Math.floor((width - containerPadding - gap) / 2);
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

    // 立即执行布局，让图片占据瀑布流位置
    // 使用 requestAnimationFrame 确保DOM更新完成
    requestAnimationFrame(() => {
      layoutWaterfall();
    });
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

  // 预加载其余图片的缩略图
  useEffect(() => {
    if (mediaData.length > 0) {
      // 获取需要预加载的图片缩略图（第16张及以后）
      const imagesToPreload = mediaData
        .filter(item => item.type === 'image')
        .slice(15); // 从第16张开始

      // 预加载缩略图
      imagesToPreload.forEach(item => {
        const img = new Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, item.thumbnail]));
        };
        img.onerror = () => {
          console.warn(`Failed to preload thumbnail: ${item.thumbnail}`);
        };
        img.src = item.thumbnail;
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
    // 获取按钮位置
    if (loadMoreButtonRef.current) {
      const rect = loadMoreButtonRef.current.getBoundingClientRect();
      setButtonPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height
      });
    }

    setIsLoadingMore(true);

    // 显示加载动画2秒，给用户更好的体验
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 显示所有图片，让它们逐个加载并布局
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
  const handleImageClick = (imageSrc, thumbnailSrc) => {
    const imageViewer = document.createElement('div');
    imageViewer.className = 'fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center';

    // 先显示缩略图，然后加载高清图
    imageViewer.innerHTML = `
      <div class="relative w-full h-full flex items-center justify-center">
        <!-- 关闭按钮 -->
        <button class="close-btn absolute top-4 right-4 text-white text-2xl z-20 hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center">×</button>
        
        <!-- 控制按钮 -->
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          <button class="zoom-btn bg-black bg-opacity-50 text-white px-4 py-2 rounded-full hover:bg-opacity-70 transition-all" data-action="zoom-out">缩小</button>
          <button class="zoom-btn bg-black bg-opacity-50 text-white px-4 py-2 rounded-full hover:bg-opacity-70 transition-all" data-action="reset">重置</button>
          <button class="zoom-btn bg-black bg-opacity-50 text-white px-4 py-2 rounded-full hover:bg-opacity-70 transition-all" data-action="zoom-in">放大</button>
        </div>
        
        <!-- 图片容器 -->
        <div class="image-container relative overflow-hidden cursor-grab active:cursor-grabbing" style="max-width: 90vw; max-height: 90vh;">
          <img src="${thumbnailSrc}" class="image-content max-w-full max-h-full object-contain opacity-50 transition-all duration-300" alt="Loading..." style="transform: scale(1); transform-origin: center;">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    `;

    // 添加类名用于样式控制
    imageViewer.classList.add('image-viewer');
    document.body.appendChild(imageViewer);

    // 图片缩放和拖拽功能
    let scale = 1;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;

    const imageContainer = imageViewer.querySelector('.image-container');
    const imageContent = imageViewer.querySelector('.image-content');
    const zoomButtons = imageViewer.querySelectorAll('.zoom-btn');
    const closeButton = imageViewer.querySelector('.close-btn');

    // 更新图片变换
    const updateTransform = () => {
      imageContent.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    };

    // 缩放功能（以屏幕中心为基准）
    const zoom = (direction) => {
      const zoomFactor = 0.2;
      const oldScale = scale;

      if (direction === 'in') {
        scale = Math.min(scale + zoomFactor, 5); // 最大5倍
      } else if (direction === 'out') {
        scale = Math.max(scale - zoomFactor, 0.1); // 最小0.1倍
      } else if (direction === 'reset') {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
        return;
      }

      // 以屏幕中心为基准缩放
      const scaleRatio = scale / oldScale;
      translateX = translateX * scaleRatio;
      translateY = translateY * scaleRatio;

      updateTransform();
    };

    // 鼠标滚轮缩放（以屏幕中心为基准）
    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? -0.1 : 0.1;
      const oldScale = scale;
      scale = Math.max(0.1, Math.min(5, scale + zoomFactor));

      // 以屏幕中心为基准缩放
      const scaleRatio = scale / oldScale;
      translateX = translateX * scaleRatio;
      translateY = translateY * scaleRatio;

      updateTransform();
    };

    // 拖拽功能
    const handleMouseDown = (e) => {
      if (scale > 1) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        imageContainer.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e) => {
      if (isDragging && scale > 1) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      imageContainer.style.cursor = scale > 1 ? 'grab' : 'default';
    };

    // 添加事件监听器
    imageContainer.addEventListener('wheel', handleWheel);
    imageContainer.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 按钮事件
    zoomButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        if (action === 'zoom-in') zoom('in');
        else if (action === 'zoom-out') zoom('out');
        else if (action === 'reset') zoom('reset');
      });
    });

    // 关闭按钮事件
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closeViewer();
    });

    // 加载高清图片
    const highResImg = new Image();
    highResImg.onload = () => {
      // 高清图片加载完成，替换缩略图
      const loadingElement = imageViewer.querySelector('.animate-spin').parentElement;

      imageContent.src = imageSrc;
      imageContent.className = 'image-content max-w-full max-h-full object-contain opacity-100 transition-all duration-300';
      loadingElement.remove();

      // 标记为已加载高清图片
      setHighResImages(prev => new Set([...prev, imageSrc]));
    };
    highResImg.onerror = () => {
      console.warn(`Failed to load high-res image: ${imageSrc}`);
      // 加载失败时移除加载动画
      const loadingElement = imageViewer.querySelector('.animate-spin').parentElement;
      if (loadingElement) {
        loadingElement.remove();
      }
    };
    highResImg.src = imageSrc;

    // 关闭查看器的函数
    const closeViewer = () => {
      // 清理事件监听器
      imageContainer.removeEventListener('wheel', handleWheel);
      imageContainer.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      imageViewer.remove();
    };

    // 点击背景关闭
    imageViewer.addEventListener('click', (e) => {
      // 点击空白处（背景）或图片容器时关闭
      if (e.target === imageViewer || e.target === imageContainer) {
        closeViewer();
      }
    });

    // 键盘快捷键
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeViewer();
      } else if (e.key === '+' || e.key === '=') {
        zoom('in');
      } else if (e.key === '-') {
        zoom('out');
      } else if (e.key === '0') {
        zoom('reset');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
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
                  onClick={() => handleImageClick(item.src, item.thumbnail)}
                >
                  {!loadedImages.has(item.thumbnail) && !preloadedImages.has(item.thumbnail) && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={item.thumbnail}
                    alt={item.alt}
                    className={`w-full h-auto object-cover transition-opacity duration-300 ${loadedImages.has(item.thumbnail) || preloadedImages.has(item.thumbnail) ? 'opacity-100' : 'opacity-0'
                      }`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(index, item.thumbnail)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  {/* 高清图片加载指示器 */}
                  {highResImages.has(item.src) && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* 局部加载动画 - 限制在瀑布流容器内 */}
          {isLoadingMore && (
            <div className="absolute inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg">
              {/* 极简加载动画 - 定位在按钮位置 */}
              <div
                className="absolute flex flex-col items-center justify-center"
                style={{
                  left: buttonPosition.x - 80,
                  top: buttonPosition.y - 80,
                  width: 160,
                  height: 160,
                  animation: 'minimalFadeIn 0.4s ease-out forwards'
                }}
              >
                {/* 极简旋转器 */}
                <div className="relative mb-6 w-6 h-6">
                  <div className="absolute inset-0 border border-white border-opacity-30 rounded-full"></div>
                  <div className="absolute inset-0 border border-transparent border-t-white rounded-full animate-spin" style={{ animationDuration: '1.2s' }}></div>
                </div>

                {/* 极简文字 */}
                <div className="text-center">
                  <p className="text-white text-xs font-normal tracking-widest uppercase">Loading</p>
                  <div className="w-12 h-px bg-white mx-auto mt-2 opacity-60"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 查看更多按钮 */}
        {!showAll && mediaData.length > 15 && (
          <div className="flex justify-center mt-8">
            <button
              ref={loadMoreButtonRef}
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
