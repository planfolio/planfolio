# Node.js 18 알파인 버전 사용 (경량화)
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 애플리케이션 소스 복사
COPY . .

# uploads 디렉토리 생성 (권한 설정)
RUN mkdir -p uploads && chmod 755 uploads

# 3000번 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "app.js"]
