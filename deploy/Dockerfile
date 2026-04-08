# Multi-stage: build Vite SPA → serve com Caddy
# Uso: docker build --build-arg APP=keep-biz -f deploy/Dockerfile .

FROM node:22-alpine AS build
ARG APP
WORKDIR /app
COPY mocks/${APP}/package.json mocks/${APP}/package-lock.json ./
RUN npm ci
COPY mocks/${APP}/ ./
RUN npm run build

FROM caddy:alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
EXPOSE 80
