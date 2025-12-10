# Etapa de compilación 1: Dependencias
FROM node:20-alpine AS dev-deps
WORKDIR /app
COPY package.json package.json
RUN npm install

# Etapa 2: Construcción (Builder)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:1.23.3 AS prod
EXPOSE 80
# Aquí aplicamos la instrucción de la guía de usar TU ruta exacta 
COPY --from=builder /app/dist/juegomesa/browser/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]