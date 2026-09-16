# --- Etapa 1: build -----------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Copiar primero los manifiestos aprovecha la caché de capas de Docker: las
# dependencias sólo se reinstalan si cambia package-lock.json.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Etapa 2: servidor --------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
