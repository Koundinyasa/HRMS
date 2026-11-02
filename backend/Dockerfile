
# Build stage
FROM node:24-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# Production stage
FROM node:24-bookworm-slim AS production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY --from=build /app/documents ./documents

RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "dist/main.js"]