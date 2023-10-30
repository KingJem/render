FROM node:20.9.0-slim

MAINTAINER qqqqivy@gmail.com

LABEL org.opencontainers.image.authors="qqqqivy@gmail.com"
ENV NODE_ENV production
ENV TZ Asia/Shanghai
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true


WORKDIR /app
COPY . ./
# 安装项目依赖包
# RUN cd /etc/yum.repos.d/
# RUN sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
# RUN sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*
RUN npm install

EXPOSE 8001
CMD ["npm", "start"]
