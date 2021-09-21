FROM node:15

WORKDIR /app

COPY ./ ./

RUN npm install

CMD ["node", "/app/api/index.js"]

EXPOSE 8080