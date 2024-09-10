# Uso de una imagen base ligera de Node.js para el backend
FROM node:20.3.0-slim AS backend

# Instalar redis-tools para tener acceso a redis-cli
RUN apt-get update && apt-get install -y --no-install-recommends redis-tools \
    && rm -rf /var/lib/apt/lists/*

# Definir el directorio de trabajo para el backend
WORKDIR /app

# Copiar y instalar dependencias del backend
COPY package*.json ./
RUN npm install

# Copiar el resto de los archivos del backend
COPY . .

# Construcción del frontend
FROM node:20.3.0-slim AS frontend

# Definir el directorio de trabajo para el frontend
WORKDIR /frontend

# Copiar y instalar dependencias del frontend
COPY svelte/package*.json ./
RUN npm install

# Construir el frontend
COPY svelte/ ./
RUN npm run build

# Limpiar directorios no necesarios
RUN rm -rf src node_modules

# Construir la imagen final con ambos resultados
FROM node:20.3.0-slim

# Copiar el backend desde la etapa anterior
COPY --from=backend /app /app

# Copiar los archivos compilados del frontend al backend (solo el directorio public)
COPY --from=frontend /frontend/public /app/public

# Definir el directorio de trabajo para el contenedor final
WORKDIR /app

# Establecer variables de entorno
ENV REDIS_HOST=172.17.0.3
ENV REDIS_PORT=6379
ENV APP_PORT=3000
ENV APP_MODE=1
ENV API_URL=https://13.58.164.15:3000
ENV REDIS_PASSWORD=perritoencuatro

# Exponer el puerto que la aplicación usará
EXPOSE 3000

# Comando para iniciar la aplicación cuando el contenedor se ejecute
CMD ["node", "server.js"]
