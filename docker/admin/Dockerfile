# Build Stage
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN rm -f package-lock.json && npm install --legacy-peer-deps
COPY . . 
COPY .env .env
RUN npm rebuild lightningcss
RUN npm run build

# Production Stage
FROM node:22-bookworm-slim AS runner
WORKDIR /app
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
