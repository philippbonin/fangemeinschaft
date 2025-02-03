# Deployment Guide

## Environment Configuration

The application uses a single `.env` file for configuration. Copy `.env.example` to create your `.env` file:

```bash
cp .env.example .env
```

### Environment Variables

1. **Database Configuration**
   ```env
   DATABASE_URL="mysql://user:password@host:3306/database"
   DB_USER=database_user
   DB_PASSWORD=database_password
   DB_NAME=database_name
   MYSQL_ROOT_PASSWORD=root_password
   ```

2. **Application Configuration**
   ```env
   NODE_ENV=development|production
   HOST=0.0.0.0
   PORT=3000
   ```

3. **JWT Configuration**
   ```env
   JWT_SECRET=your-secret-key
   ```

4. **Redis Configuration** (optional)
   ```env
   REDIS_URL=redis://localhost:6379
   ```

5. **Build Configuration**
   ```env
   BUILD_TIMESTAMP=YYYYMMDDHHmmss
   ```

6. **Feature Flags**
   ```env
   ENABLE_CHAT=true|false
   ENABLE_BUILD_LABEL=true|false
   ```

7. **Production SSL** (production only)
   ```env
   SSL_CERT_PATH=/etc/letsencrypt/live/domain/fullchain.pem
   SSL_KEY_PATH=/etc/letsencrypt/live/domain/privkey.pem
   DOMAIN=your-domain.com
   ```

## Development Deployment

1. Create development environment:
   ```bash
   cp .env.example .env
   ```

2. Start services:
   ```bash
   docker-compose -f deployment/docker-compose.yml up -d
   ```

3. Initialize database:
   ```bash
   docker-compose exec app ./deployment/init-db.sh
   ```

## Production Deployment

1. Create production environment:
   ```bash
   cp .env.example .env
   ```

2. Update production values:
   ```env
   NODE_ENV=production
   DB_PASSWORD=secure-production-password
   MYSQL_ROOT_PASSWORD=secure-root-password
   JWT_SECRET=secure-production-secret
   ```

3. Build and deploy:
   ```bash
   export BUILD_TIMESTAMP=$(date +%Y%m%d%H%M%S)
   docker-compose -f deployment/docker-compose.prod.yml up -d --build
   ```

## Overview

This document explains how to deploy the Fangemeinschaft application using Docker in different environments.

## Prerequisites

- Docker Engine 24.0+
- Docker Compose 2.0+
- Node.js 18+ (for local development)
- Git (for version control)

## Project Structure

```
/
├── deployment/              # Deployment configurations
│   ├── docker-compose.yml      # Development compose
│   ├── docker-compose.prod.yml # Production compose
│   ├── Dockerfile             # Development Dockerfile
│   ├── Dockerfile.prod        # Production Dockerfile
│   ├── Dockerfile.test        # Testing Dockerfile
│   ├── init-db.sh            # Database initialization
│   └── nginx/                # Nginx configurations
├── prisma/                 # Database configurations
├── src/                    # Application source
└── docker-compose.yml      # Root compose file
```

## Environment Setup

1. Create environment files:

`.env.prod`:
```env
# Database
DB_USER=fangemeinschaft
DB_PASSWORD=your-secure-password
DB_NAME=fangemeinschaft
MYSQL_ROOT_PASSWORD=your-root-password

# JWT
JWT_SECRET=your-jwt-secret

# App
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
```

## Deployment Steps

### 1. Development Environment

```bash
# Start development environment
docker-compose up -d

# Watch logs
docker-compose logs -f

# Stop environment
docker-compose down
```

### 2. Production Environment

```bash
# Build and start production environment
./build.sh

# Or manually:
export BUILD_TIMESTAMP=$(date +%Y%m%d%H%M%S)
docker-compose -f deployment/docker-compose.prod.yml --env-file .env.prod build \
  --build-arg BUILD_TIMESTAMP=$BUILD_TIMESTAMP \
  --no-cache
docker-compose -f deployment/docker-compose.prod.yml --env-file .env.prod up -d
```

### 3. Testing Environment

```bash
# Run tests in Docker
docker-compose -f deployment/docker-compose.test.yml up --build
```

### 4. Remarks

Here's when and how to use it:

When to use build.sh:

When deploying to production environment
When you need to start all production services
After making changes that need to be deployed to production
How to use it:


# Make script executable if needed
chmod +x build.sh

# Run the script
./build.sh
The script will:

Start all services defined in deployment/docker-compose.prod.yml
Use the production environment variables from .env.prod
Start the services in detached mode (-d flag)
Key differences from development:

Uses production Docker Compose file
Uses production environment variables
Includes Nginx Proxy Manager for SSL/TLS
Has production-optimized container configurations
Do NOT use build.sh for:

Local development (use docker-compose up instead)
Testing (use test-specific commands)
CI/CD pipelines (they should have their own deployment scripts)
The script is specifically designed for production deployment and should be used as part of your production deployment process.

For local development, you should use:


docker-compose up -d
For testing:


docker-compose -f deployment/docker-compose.test.yml u

## Container Architecture

### Production Stack

1. **Application Container (`app`)**
   - Node.js 18 Alpine
   - Runs Astro SSR server
   - Connects to database
   - Handles API requests
   ```yaml
   app:
     build:
       context: ..
       dockerfile: deployment/Dockerfile.prod
     environment:
       - NODE_ENV=production
       - DB_HOST=db
     depends_on:
       db:
         condition: service_healthy
   ```

2. **Database Container (`db`)**
   - MariaDB latest
   - Persistent volume
   - Health checks
   ```yaml
   db:
     image: mariadb:latest
     volumes:
       - mariadb-data:/var/lib/mysql
     environment:
       - MARIADB_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
     healthcheck:
       test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
   ```

3. **Nginx Container (`nginx`)**
   - Alpine-based
   - Reverse proxy
   - SSL termination
   - Static file serving
   ```yaml
   nginx:
     image: nginx:alpine
     volumes:
       - ./nginx/conf.d:/etc/nginx/conf.d:ro
       - ../dist:/usr/share/nginx/html:ro
     depends_on:
       - app
   ```

## Database Management

### 1. Initial Setup

```bash
# Initialize database
docker-compose exec app ./init-db.sh

# Run migrations
docker-compose exec app npx prisma migrate deploy
```

### 2. Backup and Restore

```bash
# Backup
docker-compose exec db mysqldump -u root -p fangemeinschaft > backup.sql

# Restore
docker-compose exec -T db mysql -u root -p fangemeinschaft < backup.sql
```

## Scaling and Performance

### 1. Resource Limits

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
  
  db:
    deploy:
      resources:
        limits:
          cpus: '0.3'
          memory: 256M
```

### 2. Load Balancing

```nginx
upstream app_servers {
    server app:3000;
    server app_2:3000;
    server app_3:3000;
}

server {
    location / {
        proxy_pass http://app_servers;
    }
}
```

## Monitoring and Logging

### 1. Container Logs

```bash
# View logs
docker-compose logs -f [service]

# View specific service logs
docker-compose logs -f app
docker-compose logs -f db
```

### 2. Health Checks

```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Security Considerations

### 1. Network Security

```yaml
networks:
  app-network:
    driver: bridge
    internal: true  # No external access
```

### 2. Secrets Management

```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

### 3. Container Security

```dockerfile
# Run as non-root user
USER node

# Use multi-stage builds
FROM node:18-alpine AS builder
# ... build steps ...

FROM node:18-alpine
COPY --from=builder /app/dist ./dist
```

## Troubleshooting

### 1. Container Issues

```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs -f [service]

# Access container shell
docker-compose exec [service] sh
```

### 2. Database Issues

```bash
# Check database connection
docker-compose exec db mysqladmin ping -h localhost

# Check database logs
docker-compose logs db
```

### 3. Application Issues

```bash
# Check application logs
docker-compose logs app

# Access application shell
docker-compose exec app sh

# Check application health
curl http://localhost:3000/api/health
```

## Maintenance

### 1. Updates

```bash
# Pull latest images
docker-compose pull

# Rebuild containers
docker-compose build --no-cache

# Restart services
docker-compose up -d
```

### 2. Cleanup

```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune
```

## Development Workflow

### 1. Local Development

```bash
# Start development environment
docker-compose up -d

# Run tests
docker-compose -f deployment/docker-compose.test.yml up

# Build production image
docker-compose -f deployment/docker-compose.prod.yml build
```

### 2. CI/CD Integration

```yaml
# Example GitHub Actions workflow
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and deploy
        run: |
          export BUILD_TIMESTAMP=$(date +%Y%m%d%H%M%S)
          docker-compose -f deployment/docker-compose.prod.yml build
          docker-compose -f deployment/docker-compose.prod.yml up -d
```