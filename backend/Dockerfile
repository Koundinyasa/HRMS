FROM node:24-bookworm-slim

WORKDIR /app

ENV TZ=Asia/Kolkata

# Install timezone data
RUN apt-get update && apt-get install -y --no-install-recommends \
    tzdata \
    && ln -snf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime \
    && echo Asia/Kolkata > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install all dependencies, including NestJS CLI
RUN npm ci --include=dev

# Copy application source
COPY . .

# Build NestJS application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Set production environment
ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main.js"]