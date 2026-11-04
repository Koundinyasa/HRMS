
FROM node:24-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV TZ=Asia/Kolkata

# Install timezone data
RUN apt-get update && apt-get install -y --no-install-recommends \
    tzdata \
    && ln -snf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime \
    && echo Asia/Kolkata > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .

RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

EXPOSE 3001

CMD ["node", "dist/main.js"]