# ==========================================================
# KTS-PEOPLE360 BACKEND
# NestJS + Node.js 24
# ==========================================================

# ----------------------------------------------------------
# STAGE 1: BUILD
# ----------------------------------------------------------

FROM node:24-trixie-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ----------------------------------------------------------
# STAGE 2: PRODUCTION
# ----------------------------------------------------------

FROM node:24-trixie-slim AS production

ENV NODE_ENV=production
ENV TZ=Asia/Kolkata

WORKDIR /app

# ----------------------------------------------------------
# Configure timezone and update OS packages
# ----------------------------------------------------------

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends tzdata \
    && ln -snf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime \
    && echo Asia/Kolkata > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

# ----------------------------------------------------------
# Install production dependencies only
# ----------------------------------------------------------

COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force \
    && rm -rf /usr/local/lib/node_modules/npm \
              /usr/local/bin/npm \
              /usr/local/bin/npx

# ----------------------------------------------------------
# Copy compiled NestJS application
# ----------------------------------------------------------

COPY --from=build /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "dist/main.js"]