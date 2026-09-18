# ==========================================
# DesaAI Multi-stage Dockerfile
# Cross-Platform for Windows & macOS (ARM/x86)
# ==========================================

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# 1. Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 2. Development Stage (Hot-reloading & local development)
FROM base AS development
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]

# 3. Builder Stage (Production Build)
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# 4. Production Runner Stage
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "run", "preview"]
