# ── Fase 1: build Angular ─────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production

# ── Fase 2: servir con nginx ──────────────────────────────────────────────────
FROM nginx:alpine

# Copiar los archivos compilados de Angular
COPY --from=build /app/dist/kapido-frontend/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
