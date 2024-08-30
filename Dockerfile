
FROM node:20.3.0-slim 

ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

ENV APP_PORT=3000

WORKDIR /app

COPY . .

RUN npm install
RUN npm run start

COPY  . .

EXPOSE 3000
WORKDIR /app

CMD ["node", "server.js"]