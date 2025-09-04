#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量重命名脚本 - 将mypub文件夹中的图片文件重命名为连续的数字格式
"""

import os
import re
from pathlib import Path

def rename_files():
    # 设置mypub文件夹路径
    mypub_path = Path("public/mypub")
    
    if not mypub_path.exists():
        print(f"错误: 文件夹 {mypub_path} 不存在")
        return
    
    # 获取所有图片文件
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'}
    image_files = []
    
    for file_path in mypub_path.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in image_extensions:
            image_files.append(file_path)
    
    if not image_files:
        print("没有找到图片文件")
        return
    
    # 按文件名排序（确保重命名顺序一致）
    image_files.sort(key=lambda x: x.name)
    
    print(f"找到 {len(image_files)} 个图片文件:")
    for i, file_path in enumerate(image_files, 1):
        print(f"  {i}. {file_path.name}")
    
    # 重命名文件
    renamed_files = []
    for i, file_path in enumerate(image_files, 1):
        # 保持原文件扩展名
        extension = file_path.suffix
        new_name = f"image_{i:02d}{extension}"
        new_path = file_path.parent / new_name
        
        try:
            file_path.rename(new_path)
            renamed_files.append(new_name)
            print(f"重命名: {file_path.name} -> {new_name}")
        except Exception as e:
            print(f"重命名失败 {file_path.name}: {e}")
    
    print(f"\n重命名完成! 共处理 {len(renamed_files)} 个文件")
    
    # 生成新的fileList数组
    print("\n新的fileList数组:")
    print("const fileList = [")
    for filename in renamed_files:
        print(f"  '{filename}',")
    print("];")
    
    return renamed_files

if __name__ == "__main__":
    print("开始批量重命名...")
    rename_files()
