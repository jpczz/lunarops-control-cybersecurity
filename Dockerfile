FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src

RUN addgroup -S lunarops && adduser -S lunarops -G lunarops

USER lunarops

EXPOSE 3000

CMD ["node", "src/server.js"]