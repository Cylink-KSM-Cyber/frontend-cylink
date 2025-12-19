# Build Stage
FROM node:22-bookworm-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
COPY .env .env

RUN npm run build

# Production Stage
FROM node:22-bookworm-slim
WORKDIR /app

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
