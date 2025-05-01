# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .

ARG NEXT_PUBLIC_BASE_API_URL
ENV NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_API_URL

RUN echo "Building with NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_API_URL"
RUN echo "NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_API_URL" >> .env

RUN npm ci --legacy-peer-deps && npm run build

# Production Stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.env .env
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package*.json ./
RUN npm ci --legacy-peer-deps --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
