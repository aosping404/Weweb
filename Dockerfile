# 使用 Node.js 18 作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 yarn.lock（如果存在）
COPY package.json yarn.lock* ./

# 安装依赖
RUN yarn install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN yarn build

# 安装 serve 来提供静态文件服务
RUN npm install -g serve

# 暴露端口
EXPOSE 9989

# 启动应用，使用自定义配置
CMD ["serve", "-c", "serve.json", "-l", "9989"]
