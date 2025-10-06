# Docker 部署指南

## 快速部署

### 使用部署脚本（推荐）
```bash
./deploy.sh
```

### 手动部署

1. **构建镜像**
```bash
docker-compose build
```

2. **启动服务**
```bash
docker-compose up -d
```

3. **查看状态**
```bash
docker-compose ps
```

4. **查看日志**
```bash
docker-compose logs -f
```

## 管理命令

### 停止服务
```bash
docker-compose down
```

### 重启服务
```bash
docker-compose restart
```

### 重新构建并启动
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

## 访问应用

应用部署成功后，可以通过以下地址访问：
- 本地访问: http://localhost:9989
- 服务器访问: http://your-server-ip:9989
- 所有网络接口: http://0.0.0.0:9989

## 配置说明

- **端口**: 9989
- **绑定地址**: 0.0.0.0 (所有网络接口)
- **容器名称**: weweblast-app
- **重启策略**: unless-stopped
- **环境**: production

## 文件说明

- `Dockerfile`: Docker 镜像构建文件
- `docker-compose.yml`: Docker Compose 配置文件
- `.dockerignore`: Docker 构建忽略文件
- `deploy.sh`: 自动化部署脚本
- `vite.config.js`: Vite 配置文件（已更新支持 9989 端口）

## 故障排除

### 端口被占用
如果 9989 端口被占用，可以修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "9989:9989"  # 改为其他端口，如 "9990:9989"
```

### 查看详细日志
```bash
docker-compose logs --tail=100 weweblast
```

### 进入容器调试
```bash
docker-compose exec weweblast sh
```
