# Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve stage
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Defaults match the raw k8s manifests in k8s/frontend + k8s/config.
# Override via env vars for Helm releases (see frontend-config template).
ENV BACKEND_HOST=backend-service
ENV BACKEND_PORT=5000

EXPOSE 80
