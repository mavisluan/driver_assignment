FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install && \
    npm run build && \
    npm run test

ENTRYPOINT ["node", "build/index.js"]