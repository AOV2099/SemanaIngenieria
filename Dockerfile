


# Etapa de construcción para el backend Node.js
# =============================================
FROM node:14 AS backend-builder

# Establecer variables de entorno
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

ENV APP_PORT = 3000

# Establece el directorio de trabajo para el backend
WORKDIR /app

# Copia y instala las dependencias del backend
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto del código fuente del backend
COPY . .

# Opcionalmente construye el código del backend, si necesario
 RUN npm run start

# Etapa de construcción para el frontend Svelte
# ============================================
FROM node:14 AS frontend-builder

# Establece el directorio de trabajo para el frontend
WORKDIR /app

# Copia y instala las dependencias del frontend
COPY svelte/package.json svelte/package-lock.json ./
RUN npm install

# Copia el resto del código fuente del frontend
COPY svelte/ ./

# Construye el proyecto Svelte
RUN npm run build

# Etapa de producción
# ===================
FROM node:14-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia los módulos y archivos construidos del backend
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app .

# Copia los archivos construidos del frontend Svelte
COPY --from=frontend-builder /app/public /public

# Expone el puerto que tu aplicación utilizará
EXPOSE 3000

# Define el comando para correr tu aplicación
CMD ["node", "server.js"]
