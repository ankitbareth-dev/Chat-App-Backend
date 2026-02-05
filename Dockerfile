# Dockerfile

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# 1. GENERATE PRISMA CLIENT
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"
ENV JWT_SECRET="temp_secret"
ENV CLIENT_URL="http://localhost:3000"

RUN npx prisma generate

# 2. Compile TypeScript
RUN npm run build


# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy compiled code
COPY --from=builder /app/dist ./dist

# Copy Prisma schema
COPY --from=builder /app/prisma ./prisma

# --- REMOVED THE LINE THAT CAUSED THE ERROR ---
# We don't need to copy .prisma because we generate it in the CMD below

ENV NODE_ENV=production

EXPOSE 3000

# Generate again to ensure compatibility with production node_modules, then start
CMD sh -c "npx prisma generate && npm start"