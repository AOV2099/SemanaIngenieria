# Uso de una imagen base ligera de Node.js
FROM node:20.3.0-slim

# Definir el directorio de trabajo
WORKDIR /app

# Establecer variables de entorno
ENV REDIS_HOST=13.58.164.15
ENV REDIS_PORT=6379
ENV APP_PORT=3000
ENV APP_MODE=1

# Copiar los archivos del proyecto al directorio de trabajo
COPY . .

# Instalar dependencias
RUN npm install

# Exponer el puerto que la aplicación usará
EXPOSE 3000

# Comando para iniciar la aplicación cuando el contenedor se ejecute
CMD ["node", "server.js"]
