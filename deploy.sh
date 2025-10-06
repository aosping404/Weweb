#!/bin/bash

# Docker 部署脚本
echo "开始构建和部署 weweblast 应用..."

# 停止现有容器
echo "停止现有容器..."
docker compose down

# 构建镜像
echo "构建 Docker 镜像..."
docker compose build

# 启动服务
echo "启动服务..."
docker compose up -d

# 显示状态
echo "服务状态："
docker compose ps

echo "部署完成！"
echo "应用运行在 http://localhost:9989"
echo "查看日志: docker compose logs -f"
