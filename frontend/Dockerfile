# ==========================================================
# KTS-PEOPLE360 FRONTEND
# React + Vite + Nginx
# ==========================================================

# ----------------------------------------------------------
# STAGE 1: BUILD FRONTEND
# ----------------------------------------------------------

FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL=/api

ENV TZ=Asia/Kolkata
ENV VITE_API_URL=${VITE_API_URL}

RUN apk add --no-cache tzdata

RUN npm run build

# ----------------------------------------------------------
# STAGE 2: NGINX PRODUCTION SERVER
# ----------------------------------------------------------

FROM nginx:alpine AS production

ENV TZ=Asia/Kolkata

# Update Alpine security packages and install timezone data
RUN apk update \
    && apk upgrade --no-cache \
    && apk add --no-cache tzdata \
    && ln -snf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime \
    && echo "Asia/Kolkata" > /etc/timezone

# Copy Vite production build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]