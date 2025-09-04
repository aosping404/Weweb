#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量生成缩略图脚本
将 mypub 文件夹中的图片生成缩略图到 mypub/thumbnails 文件夹
"""

import os
from PIL import Image
from pathlib import Path

def generate_thumbnails():
    """生成缩略图"""
    # 源文件夹和目标文件夹
    source_dir = Path("public/mypub")
    target_dir = Path("public/mypub/thumbnails")
    
    # 创建目标文件夹
    target_dir.mkdir(exist_ok=True)
    
    # 支持的图片格式
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'}
    
    # 缩略图尺寸
    thumbnail_size = (300, 300)  # 可以根据需要调整
    
    processed_count = 0
    error_count = 0
    
    print("开始生成缩略图...")
    
    # 遍历源文件夹中的所有文件
    for file_path in source_dir.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in image_extensions:
            try:
                # 打开图片
                with Image.open(file_path) as img:
                    # 转换为RGB模式（处理RGBA等模式）
                    if img.mode in ('RGBA', 'LA', 'P'):
                        # 创建白色背景
                        background = Image.new('RGB', img.size, (255, 255, 255))
                        if img.mode == 'P':
                            img = img.convert('RGBA')
                        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                        img = background
                    elif img.mode != 'RGB':
                        img = img.convert('RGB')
                    
                    # 生成缩略图（保持宽高比）
                    img.thumbnail(thumbnail_size, Image.Resampling.LANCZOS)
                    
                    # 保存缩略图
                    thumbnail_path = target_dir / file_path.name
                    img.save(thumbnail_path, 'JPEG', quality=85, optimize=True)
                    
                    processed_count += 1
                    print(f"✓ 已处理: {file_path.name}")
                    
            except Exception as e:
                error_count += 1
                print(f"✗ 处理失败: {file_path.name} - {str(e)}")
    
    print(f"\n处理完成!")
    print(f"成功处理: {processed_count} 个文件")
    print(f"处理失败: {error_count} 个文件")
    print(f"缩略图保存在: {target_dir}")

if __name__ == "__main__":
    generate_thumbnails()
