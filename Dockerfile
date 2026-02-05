# Dockerfile

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code (root directory)
COPY . .

# Compile TypeScript
RUN npm run build

# Generate Prisma Client inside the build
RUN npx prisma generate


# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy compiled code
COPY --from=builder /app/dist ./dist

# Copy Prisma folder
COPY --from=builder /app/prisma ./prisma

# Copy generated Prisma Client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

ENV NODE_ENV=production

EXPOSE 3000

# We run 'prisma generate' again to ensure compatibility with the node environment
# then we start the server. We do NOT run 'migrate deploy' here.
CMD sh -c "npx prisma generate && npm start"