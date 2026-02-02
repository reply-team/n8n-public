FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM n8nio/n8n:latest

USER root

COPY --from=build /app/package.json /tmp/reply-node/
COPY --from=build /app/dist/ /tmp/reply-node/dist/

WORKDIR /tmp/reply-node
RUN npm pack && npm install -g *.tgz && rm -rf /tmp/reply-node

USER node
WORKDIR /home/node

ENV N8N_CUSTOM_EXTENSIONS=/usr/local/lib/node_modules/@replyio/n8n-nodes-reply
