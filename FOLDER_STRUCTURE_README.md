# BLOOMSCROLL 瀑布流媒体库 - 文件夹结构说明

## 📁 文件夹组织结构

### **统一媒体文件夹** (`public/mypub/`)
```
public/mypub/
├── hero-1.mp4          # 英雄视频 1
├── hero-2.mp4          # 英雄视频 2
├── hero-3.mp4          # 英雄视频 3
├── hero-4.mp4          # 英雄视频 4
├── feature-1.mp4       # 特色视频 1
├── feature-2.mp4       # 特色视频 2
├── feature-3.mp4       # 特色视频 3
├── feature-4.mp4       # 特色视频 4
├── feature-5.mp4       # 特色视频 5
├── gallery-1.webp      # 画廊图片 1
├── gallery-2.webp      # 画廊图片 2
├── gallery-3.webp      # 画廊图片 3
├── gallery-4.webp      # 画廊图片 4
├── gallery-5.webp      # 画廊图片 5
├── swordman.webp       # 剑士图片
├── swordman-partial.webp # 剑士局部图片
├── stones.webp         # 石头图片
├── about.webp          # 关于图片
├── Leonardo_Phoenix_10_A_futuristic_digital_illustration_of_a_per_3.jpg # 凤凰数字艺术
├── chakra.png          # 脉轮图片
├── contact-1.webp      # 联系图片 1
├── contact-2.webp      # 联系图片 2
└── 2.png               # 图片 2
```

## 🎯 功能特性

### **文件夹过滤系统**
- ✅ **全部媒体**：显示所有视频和图片
- ✅ **视频库**：仅显示 mypub 文件夹中的视频文件
- ✅ **图片库**：仅显示 mypub 文件夹中的图片文件

### **智能布局**
- ✅ 固定3列瀑布流布局
- ✅ 图片尺寸：420px × 自适应高度
- ✅ 间距设置：5px（紧凑设计）
- ✅ 自动居中显示

### **交互功能**
- ✅ 文件夹切换按钮
- ✅ 媒体计数显示
- ✅ 视频悬停预览
- ✅ 图片/视频全屏查看

## 🚀 使用方法

### 1. **添加新视频**
1. 将视频文件放入 `public/mypub/` 目录
2. 在 `WaterfallGallery.jsx` 中的 `mediaData` 数组添加新条目：
```javascript
{ 
  type: 'video', 
  src: '/mypub/your-new-video.mp4', 
  thumbnail: '/img/play.svg', 
  alt: 'Your Video Description', 
  folder: 'videos' 
}
```

### 2. **添加新图片**
1. 将图片文件放入 `public/mypub/` 目录
2. 在 `WaterfallGallery.jsx` 中的 `mediaData` 数组添加新条目：
```javascript
{ 
  type: 'image', 
  src: '/mypub/your-new-image.jpg', 
  alt: 'Your Image Description', 
  folder: 'gallery' 
}
```

### 3. **自动布局**
- 系统会自动识别新添加的媒体文件
- 瀑布流布局会自动调整
- 文件夹过滤功能立即生效

## 🔧 技术实现

### **组件结构**
```javascript
const WaterfallGallery = () => {
  const [selectedFolder, setSelectedFolder] = useState('all');
  
  // 媒体数据数组 - 统一使用 mypub 文件夹
  const mediaData = [
    // 视频文件
    { type: 'video', src: '/mypub/...', folder: 'videos' },
    // 图片文件
    { type: 'image', src: '/mypub/...', folder: 'gallery' }
  ];
  
  // 过滤逻辑
  const filteredMediaData = useMemo(() => {
    if (selectedFolder === 'all') return mediaData;
    return mediaData.filter(item => item.folder === selectedFolder);
  }, [selectedFolder, mediaData]);
};
```

### **文件夹选择器**
```jsx
<div className="flex justify-center mb-6">
  <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-1">
    <button onClick={() => setSelectedFolder('all')}>全部媒体</button>
    <button onClick={() => setSelectedFolder('videos')}>视频库</button>
    <button onClick={() => setSelectedFolder('gallery')}>图片库</button>
  </div>
</div>
```

## 📱 响应式设计

### **桌面端**
- 3列瀑布流布局
- 420px 图片宽度
- 5px 间距

### **移动端**
- 自动调整为2列或1列
- 保持瀑布流效果
- 触摸友好的交互

## 🎨 样式定制

### **文件夹选择器样式**
```css
.folder-selector {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 4px;
}

.folder-button {
  transition: all 0.2s ease;
  border-radius: 6px;
  padding: 8px 16px;
}

.folder-button.active {
  background: white;
  color: #1f2937;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### **媒体计数样式**
```css
.media-count {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  text-align: center;
  margin-bottom: 16px;
}
```

## 🔄 更新和维护

### **添加新文件夹类型**
1. 在 `mediaData` 中添加 `folder: 'new-folder'` 属性
2. 在文件夹选择器中添加新按钮
3. 更新过滤逻辑

### **修改文件夹路径**
1. 更新 `mediaData` 中的 `src` 路径
2. 确保物理文件夹结构匹配
3. 测试所有媒体文件加载

## 📋 注意事项

1. **文件格式支持**
   - 视频：MP4, WebM, OGV
   - 图片：JPG, PNG, WebP, GIF

2. **文件命名规范**
   - 使用小写字母和连字符
   - 避免空格和特殊字符
   - 保持文件名简洁明了

3. **性能优化**
   - 图片使用 WebP 格式
   - 视频文件适当压缩
   - 启用懒加载

4. **SEO 友好**
   - 为每个媒体文件添加描述性 alt 文本
   - 使用语义化的文件名
   - 保持文件结构清晰

## 🎯 未来扩展

### **计划功能**
- [ ] 动态文件夹扫描
- [ ] 拖拽上传支持
- [ ] 批量文件管理
- [ ] 高级搜索和标签
- [ ] 收藏夹功能
- [ ] 分享和导出

### **技术改进**
- [ ] 虚拟滚动优化
- [ ] 图片预加载策略
- [ ] 缓存机制优化
- [ ] 离线支持

---

**版本**: v3.1.0  
**更新日期**: 2024年12月  
**维护者**: BLOOMSCROLL 开发团队
