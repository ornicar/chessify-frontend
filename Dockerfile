FROM node:16.3.0-alpine

RUN apk update && apk add python2 python3 make g++ gcc vim
COPY . /app
#RUN cd /app/new-webview && npm install &&  npm run build -- --dist="/app/public/assets/board/"
RUN cd /app && npm install && npm run build && npm install -g serve
