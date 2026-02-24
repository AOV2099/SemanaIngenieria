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
ENV APP_PORT=3000 \
    APP_MODE=1 \
    API_URL=https://132.248.44.4:3000 \
    REDIS_URL=redis://redis-stack:6379 \
    REDIS_PASSWORD=perritoencuatro \
    ADMIN_PASS=Pr0f3soR \
    ADMIN_USER=profesor-test

# Exponer el puerto que utiliza tu aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
