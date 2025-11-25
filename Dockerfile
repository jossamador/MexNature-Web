# Etapa 1: Construcción de Angular
FROM node:20-alpine as build
WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
RUN npm ci

# Copiar código fuente y compilar
COPY . .
RUN npm run build

# Etapa 2: Servidor Web Nginx
FROM nginx:alpine

# Copiar los archivos compilados de Angular al servidor Nginx
# NOTA: Verificamos que el nombre coincida con tu angular.json ('MexNature.Web')
# Angular suele normalizar los nombres a minúsculas en la carpeta dist, 
# así que usamos 'mex-nature.web' que es el estándar.
COPY --from=build /app/dist/mex-nature.web/browser /usr/share/nginx/html

# Copiar la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80