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

# La imagen nginx:alpine procesa automáticamente los templates en /etc/nginx/templates/
# sustituyendo variables de entorno (como $PORT) antes de arrancar
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 8080
