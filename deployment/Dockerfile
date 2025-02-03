FROM node:18-alpine

WORKDIR /app

# Install MariaDB client
RUN apk add --no-cache mariadb-client openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema and seed script
COPY prisma /app/prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy source files
COPY . .

# Make init script executable
RUN chmod +x deployment/init-db.sh

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

EXPOSE 3000

# Run init script and start the application
CMD ["sh", "-c", "./deployment/init-db.sh && npm run dev"]