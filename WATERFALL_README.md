# BLOOMSCROLL 瀑布流媒体库

## 功能特性

### 🎥 视频支持
- 自动播放预览（鼠标悬停时）
- 点击全屏播放
- 支持所有MP4格式视频
- 响应式视频播放器

### 🖼️ 图片支持
- 高质量图片显示
- 点击全屏查看
- 懒加载优化
- 支持多种图片格式（webp, jpg, png）

### 🌊 瀑布流布局
- 基于成行元素 + 寻找新增元素追加位置的瀑布流算法
- 固定宽度设计，确保布局稳定性
- 固定3列布局，提供一致的视觉体验
- 最短列优先原则，实现真正的瀑布流效果
- 居中布局，完美适配各种屏幕尺寸

### 🔄 智能布局
- 成行元素高度数组管理
- 动态寻找最低高度列
- 智能定位新增元素
- 固定3列布局，确保一致性
- 图片加载完成后自动重新布局

## 核心算法原理

### 步骤一：构建成行元素 + 寻找新增元素追加位置
1. **计算列数**：`页面宽度 / (块宽度 + 间距)`
2. **成行元素**：前N个元素作为成行元素，记录每列高度
3. **新增元素定位**：找到高度最低的列，计算top和left值

### 步骤二：重复步骤一，依赖成行元素追加新元素
1. **遍历所有元素**：前N个作为成行元素，后续元素动态定位
2. **最短列优先**：始终选择高度最低的列放置新元素
3. **高度更新**：更新对应列的高度值

### 步骤三：响应式处理
1. **窗口大小监听**：自动重新计算列数和布局
2. **图片加载监听**：图片加载完成后重新布局
3. **延迟执行**：确保DOM更新完成后再执行布局

## 文件夹结构

### 📁 媒体文件组织
```
public/
└── mypub/               # 统一媒体文件夹
    ├── hero-1.mp4       # 视频文件
    ├── hero-2.mp4
    ├── feature-1.mp4
    ├── your-new-video.mp4
    ├── gallery-1.webp   # 图片文件
    ├── gallery-2.webp
    ├── your-new-image.jpg
    └── another-image.png
```

## 使用方法

### 1. 添加新视频
将视频文件放入 `public/mypub/` 目录，并在 `mediaData` 中添加：
```javascript
{ 
  type: 'video', 
  src: '/mypub/your-new-video.mp4', 
  thumbnail: '/img/play.svg', 
  alt: 'Your Video Description', 
  folder: 'videos' 
}
```

### 2. 添加新图片
将图片文件放入 `public/mypub/` 目录，并在 `mediaData` 中添加：
```javascript
{ 
  type: 'image', 
  src: '/mypub/your-new-image.jpg', 
  alt: 'Your Image Description', 
  folder: 'gallery' 
}
```

### 3. 文件夹过滤
系统提供三种视图模式：
- **全部媒体**：显示所有视频和图片
- **视频库**：仅显示 mypub 文件夹中的视频文件
- **图片库**：仅显示 mypub 文件夹中的图片文件

### 4. 自动布局
系统会：
- 自动计算最佳列数
- 智能分配元素位置
- 实现真正的瀑布流效果
- 根据选择的文件夹动态过滤内容

## 技术实现

### 组件结构
- `WaterfallGallery.jsx` - 主要瀑布流组件
- 集成在 `Story.jsx` 中

### 核心算法实现
```javascript
// 瀑布流布局算法
const layoutWaterfall = () => {
  const items = itemsRef.current;
  const itemWidth = 300; // 固定宽度
  const gap = 20; // 固定间距
  
  // 初始化成行元素的高度数组
  const compareArray = new Array(columns).fill(0);
  
  // 遍历所有瀑布流块
  for (let i = 0; i < items.length; i++) {
    if (i < columns) {
      // 前columns个元素作为成行元素
      compareArray[i] = items[i].offsetHeight;
    } else {
      // 获取成行元素中高度最低的值
      const minHeight = Math.min(...compareArray);
      const minHkey = getMinHeightKey(compareArray, minHeight);
      
      // 为新增的瀑布流块设置定位
      items[i].style.position = 'absolute';
      items[i].style.top = `${minHeight + gap}px`;
      items[i].style.left = `${minHkey * (itemWidth + gap)}px`;
      
      // 更新列高度
      compareArray[minHkey] += items[i].offsetHeight + gap;
    }
  }
};
```

### 响应式设计
```css
/* 瀑布流容器 */
.waterfall-container {
  position: relative;
  margin: 0 auto;
}

/* 瀑布流项目 */
.waterfall-item {
  transition: all 0.3s ease;
  will-change: transform;
}

/* 固定3列布局 */
- 固定列数：3列布局，确保一致的视觉体验
- 块尺寸：每块420px宽度 + 5px间距
- 自动居中：容器宽度自动调整，保证整体居中
```

### 动画效果
- 淡入动画：`animate-fade-in`
- 悬停缩放：`hover:scale-105`
- 平滑过渡：`transition-transform duration-300`

## 自定义配置

### 修改块宽度
在 `WaterfallGallery.jsx` 中调整：
```javascript
const itemWidth = 420; // 修改为需要的宽度
```

### 修改间距
在 `WaterfallGallery.jsx` 中调整：
```javascript
const gap = 5; // 修改为需要的间距
```

### 修改动画延迟
在CSS中调整：
```css
.animate-fade-in {
  animation: fadeInUp 0.6s ease-out forwards; /* 0.6秒动画时长 */
}
```

## 浏览器兼容性

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ 移动端浏览器

## 性能优化

- 图片懒加载
- 视频预加载优化
- 延迟布局执行，避免频繁重排
- 使用useCallback优化函数引用
- 响应式图片

## 故障排除

### 视频无法播放
1. 检查视频格式是否为MP4
2. 确认文件路径正确
3. 检查浏览器是否支持视频格式

### 图片无法显示
1. 检查图片文件是否存在
2. 确认文件路径正确
3. 检查图片格式是否支持

### 瀑布流布局异常
1. 刷新页面重新计算布局
2. 检查CSS类是否正确加载
3. 确认响应式断点设置

## 更新日志

### v3.1.0
- 统一媒体文件夹结构，所有媒体文件集中到 `public/mypub/` 目录
- 简化文件管理，提升维护效率
- 保持原有的文件夹过滤功能（全部媒体、视频库、图片库）
- 优化文件路径配置

### v3.0.0
- 新增文件夹管理系统
- 视频和图片使用独立文件夹组织
- 添加文件夹过滤功能（全部媒体、视频库、图片库）
- 媒体计数显示
- 优化用户界面和交互体验

### v2.2.0
- 图片尺寸放大为1.4倍（从300px增加到420px）
- 照片行列距离优化为5像素
- 更紧凑的布局，提升视觉密度
- 保持原有的瀑布流算法优势

### v2.1.0
- 优化为固定3列布局
- 提供一致的视觉体验
- 简化列数计算逻辑
- 保持原有的瀑布流算法优势

### v2.0.0
- 完全重新设计瀑布流组件
- 基于成行元素 + 寻找新增元素追加位置的算法
- 固定宽度设计，确保布局稳定性
- 最短列优先的瀑布流布局算法
- 智能列数计算和响应式调整
- 居中布局，完美适配各种屏幕尺寸

### v1.4.0
- 实现真正的智能瀑布流布局算法
- 基于图片横竖比例动态调整列数
- 智能内容类型识别和列数优化
- 动态列数计算（基于容器宽度和内容类型）
- 最短列优先的瀑布流布局算法
- 智能尺寸限制，防止图片过度拉伸
- 居中布局，确保完美显示

### v1.3.0
- 重构瀑布流布局，使用绝对定位替代CSS Grid
- 实现真正的瀑布流效果，图片紧密排列无空白间隙
- 动态计算容器高度，精确控制布局
- 优化响应式列数分配算法
- 修复图片超出屏幕边界问题，实现完美自适应
- 智能尺寸限制，防止图片过度拉伸
- 居中布局，确保完美显示

### v1.2.0
- 优化瀑布流布局算法
- 智能图片类型识别和宽高比计算
- 手机端紧凑布局优化（8-12px间距）
- 更精确的响应式断点（480px, 640px, 768px, 1024px）
- 使用useCallback优化性能

### v1.1.0
- 移除手动扫描按钮
- 实现基于实际图片尺寸的瀑布流布局
- 智能宽高比计算
- 谷歌风格的精确拼接效果

### v1.0.0
- 初始版本发布
- 支持视频和图片瀑布流
- 响应式设计
- 全屏播放/查看功能
