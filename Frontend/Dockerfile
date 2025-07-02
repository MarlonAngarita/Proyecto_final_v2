# Dockerfile para Angular Frontend - Producción sin Nginx
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx ng build --configuration=production

# Servir la app con un servidor Node.js simple
FROM node:20-alpine as prod
WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/package*.json ./
RUN npm install -g serve
EXPOSE 4200
CMD ["serve", "-s", "dist", "-l", "4200"]
