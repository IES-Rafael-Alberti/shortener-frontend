# Etapa 1: Construcción
FROM node:20 AS builder

WORKDIR /app

# Variables de entorno
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ARG VITE_SITE_KEY_REPACTCHA
ENV VITE_SITE_KEY_REPACTCHA=${VITE_SITE_KEY_REPACTCHA}
ARG VITE_DOMAIN
ENV VITE_DOMAIN=${VITE_DOMAIN}

# Copiar package.json y pnpm-lock.yaml/yarn.lock/package-lock.json (según tu gestor)
COPY package.json package-lock.json ./

# Instalar dependencias (sin generar node_modules innecesarios en la imagen final)
RUN npm install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar el build generado en la primera etapa
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar una configuración básica de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]