#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量重命名脚本 - 将mypub文件夹中的图片文件重命名为连续的数字格式
修复版本：正确处理删除文件后的重新编号
"""

import os
import re
import shutil
from pathlib import Path

def rename_files():
    # 设置mypub文件夹路径
    mypub_path = Path("public/mypub")
    thumbnails_path = Path("public/mypub/thumbnails")
    
    if not mypub_path.exists():
        print(f"错误: 文件夹 {mypub_path} 不存在")
        return
    
    # 获取所有图片文件（从主文件夹）
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
    
    # 创建临时文件夹来避免重命名冲突
    temp_path = mypub_path / "temp_rename"
    temp_path.mkdir(exist_ok=True)
    
    try:
        # 第一步：将所有文件复制到临时文件夹并重命名
        renamed_files = []
        for i, file_path in enumerate(image_files, 1):
            # 保持原文件扩展名
            extension = file_path.suffix
            new_name = f"image_{i:02d}{extension}"
            temp_file_path = temp_path / new_name
            
            try:
                shutil.copy2(file_path, temp_file_path)
                renamed_files.append(new_name)
                print(f"复制并重命名: {file_path.name} -> {new_name}")
            except Exception as e:
                print(f"复制失败 {file_path.name}: {e}")
        
        # 第二步：删除原文件
        print("\n删除原文件...")
        for file_path in image_files:
            try:
                file_path.unlink()
                print(f"删除: {file_path.name}")
            except Exception as e:
                print(f"删除失败 {file_path.name}: {e}")
        
        # 第三步：将重命名后的文件移回原位置
        print("\n移动重命名后的文件...")
        for temp_file in temp_path.iterdir():
            if temp_file.is_file():
                final_path = mypub_path / temp_file.name
                try:
                    shutil.move(str(temp_file), str(final_path))
                    print(f"移动: {temp_file.name}")
                except Exception as e:
                    print(f"移动失败 {temp_file.name}: {e}")
        
        # 第四步：处理缩略图文件夹
        if thumbnails_path.exists():
            print("\n处理缩略图文件夹...")
            thumbnail_files = []
            for file_path in thumbnails_path.iterdir():
                if file_path.is_file() and file_path.suffix.lower() in image_extensions:
                    thumbnail_files.append(file_path)
            
            if thumbnail_files:
                # 创建临时缩略图文件夹
                temp_thumbnails = thumbnails_path / "temp_rename"
                temp_thumbnails.mkdir(exist_ok=True)
                
                # 重命名缩略图文件
                for i, file_path in enumerate(thumbnail_files, 1):
                    extension = file_path.suffix
                    new_name = f"image_{i:02d}{extension}"
                    temp_file_path = temp_thumbnails / new_name
                    
                    try:
                        shutil.copy2(file_path, temp_file_path)
                        print(f"缩略图重命名: {file_path.name} -> {new_name}")
                    except Exception as e:
                        print(f"缩略图重命名失败 {file_path.name}: {e}")
                
                # 删除原缩略图文件
                for file_path in thumbnail_files:
                    try:
                        file_path.unlink()
                    except Exception as e:
                        print(f"删除缩略图失败 {file_path.name}: {e}")
                
                # 移动重命名后的缩略图
                for temp_file in temp_thumbnails.iterdir():
                    if temp_file.is_file():
                        final_path = thumbnails_path / temp_file.name
                        try:
                            shutil.move(str(temp_file), str(final_path))
                        except Exception as e:
                            print(f"移动缩略图失败 {temp_file.name}: {e}")
                
                # 删除临时缩略图文件夹
                temp_thumbnails.rmdir()
        
        print(f"\n重命名完成! 共处理 {len(renamed_files)} 个文件")
        
        # 生成新的fileList数组
        print("\n新的fileList数组:")
        print("const fileList = [")
        for filename in renamed_files:
            print(f"  '{filename}',")
        print("];")
        
        return renamed_files
        
    finally:
        # 清理临时文件夹
        if temp_path.exists():
            try:
                temp_path.rmdir()
                print("清理临时文件夹完成")
            except:
                print("清理临时文件夹失败")

if __name__ == "__main__":
    print("开始批量重命名...")
    rename_files()
