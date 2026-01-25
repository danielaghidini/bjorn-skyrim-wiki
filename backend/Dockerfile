# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies including devDependencies (needed for tsc)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client and build
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy production files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Expose the API port
EXPOSE 3001

# Start the server
CMD ["npm", "run", "start"]
