FROM node:14.18.1-alpine3.14
WORKDIR /app
RUN npm init -y
RUN npm install -g near-cli -y
RUN yarn add -D near-sdk-as near-api-js

COPY ./ ./
