# Build Stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
COPY .env .env

RUN npm run build

# Production Stage
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
RUN npm ci --legacy-peer-deps --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
