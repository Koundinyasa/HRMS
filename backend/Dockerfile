
# ==========================================
# Build stage
# ==========================================
FROM node:24-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# ==========================================
# Production stage
# ==========================================
FROM node:24-bookworm-slim AS production

ENV NODE_ENV=production \
    TZ=Asia/Kolkata
    
WORKDIR /app

# Install timezone data
RUN apt-get update \
    && apt-get install -y --no-install-recommends tzdata \
    && rm -rf /var/lib/apt/lists/*

# Install production dependencies only
COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force \
    && rm -rf /usr/local/lib/node_modules/npm \
              /usr/local/bin/npm \
              /usr/local/bin/npx

# Copy compiled application
COPY --from=build /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "dist/main.js"]