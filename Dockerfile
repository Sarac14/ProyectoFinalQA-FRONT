# Etapa 1: Build
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copiamos solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install -g @vue/cli@5.0.8 && npm install

# Copia el resto del código
COPY . .

# Construye la aplicación Vue para producción
RUN npm run build


# Etapa 2: Producción con Nginx
FROM nginx:stable-alpine AS production-stage

# Copiamos la build al contenedor
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Configuración Nginx para Vue Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
