FROM node:22-alpine

WORKDIR /app

# Instalar dependencias primero (mejor caching)
COPY package*.json ./
RUN npm install --omit=dev

# Copiar el código
COPY . .

# Crear directorio para uploads
RUN mkdir -p ./uploads && chmod 777 ./uploads

# Exponer puerto
EXPOSE 8080

# Iniciar
CMD ["node", "index.js"]