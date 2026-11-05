
# Stage 1: Build React/Vite application
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=/api
ENV TZ=Asia/Kolkata
RUN apk add --no-cache tzdata
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Nginx production server
FROM nginx:alpine

# Update Alpine OS packages to receive security fixes
RUN apk update && apk upgrade --no-cache

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
