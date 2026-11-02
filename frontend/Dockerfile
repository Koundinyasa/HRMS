# Build stage
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:3001/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


# Production stage
FROM nginx:alpine

# Update Alpine system packages to include available security fixes
RUN apk update && apk upgrade --no-cache

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "echo 'Frontend application running'; echo 'Website available at http://localhost:8081'; exec nginx -g 'daemon off;'"]