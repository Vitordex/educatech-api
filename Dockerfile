FROM node:lts-alpine3.9

WORKDIR /app

ARG ENV
ENV NODE_ENV=${ENV}

RUN apk add --no-cache python3 make g++

COPY package.json package.json

RUN npm i --production

COPY dist dist
COPY config config

EXPOSE 3000

CMD ["node", "dist/bin/www.js"]
