FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM n8nio/n8n:latest

USER root

COPY --from=build /app/package.json /usr/local/lib/node_modules/n8n/node_modules/@replyio/n8n-nodes-reply-dev/
COPY --from=build /app/dist/ /usr/local/lib/node_modules/n8n/node_modules/@replyio/n8n-nodes-reply-dev/dist/

USER node
WORKDIR /home/node
