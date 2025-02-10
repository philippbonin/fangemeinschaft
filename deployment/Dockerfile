# Use Debian-based Node.js image (includes OpenSSL 1.1)
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Verify OpenSSL version (should be 1.1.x)
RUN openssl version -a

# Copy package files
COPY package*.json ./

# Copy Prisma schema and seed script
COPY prisma /app/prisma/

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Make init scripts executable
RUN chmod +x deployment/init-db.sh
RUN chmod +x deployment/start-app.sh

EXPOSE 3000
