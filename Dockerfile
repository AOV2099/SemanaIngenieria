# Uso de una imagen base ligera de Node.js
FROM node:20.3.0-slim

# Instalar redis-tools para tener acceso a redis-cli
RUN apt-get update && apt-get install -y --no-install-recommends redis-tools \
    && rm -rf /var/lib/apt/lists/*

# Definir el directorio de trabajo para las operaciones del contenedor
WORKDIR /app

# Copiar solo los archivos necesarios para la instalación de dependencias del backend
COPY package*.json ./

# Instalar dependencias de Node para el backend
RUN npm install

# Copiar los archivos restantes del proyecto al contenedor
COPY . .

# Cambiar al directorio de la aplicación Svelte
WORKDIR /app/svelte

# Copiar solo los archivos necesarios para la instalación de dependencias del frontend
COPY svelte/package*.json ./

# Instalar dependencias de la aplicación Svelte
RUN npm install

# Volver al directorio principal
WORKDIR /app

# Establecer variables de entorno
ENV REDIS_HOST=172.17.0.3 \
    REDIS_PORT=6379 \
    APP_PORT=3000 \
    APP_MODE=1 \
    API_URL=https://13.58.164.15:3000 \
    REDIS_PASSWORD=perritoencuatro

# Exponer el puerto que utiliza tu aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
