# Docker Compose Configuration Documentation

## Overview

This document explains the Docker Compose configuration used for deploying the Fangemeinschaft application. The application uses a single Docker Compose file with environment-specific overrides.

## Base Configuration (`deployment/docker-compose.yml`)

The base configuration defines the core services and their common settings:

```yaml
version: '3.8'

services:
  app:
    build:
      context: ..
      dockerfile: deployment/Dockerfile
    restart: unless-stopped
    working_dir: /app
    environment:
      - NODE_ENV=development
      - HOST=0.0.0.0
      - PORT=3000
      - DB_HOST=db
      - DB_USER=${DB_USER:-fangemeinschaft}
      - DB_PASSWORD=${DB_PASSWORD:-fangemeinschaft}
      - DB_NAME=${DB_NAME:-fangemeinschaft}
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app-network

  db:
    image: mariadb:latest
    restart: unless-stopped
    environment:
      - MARIADB_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD:-rootpassword}
      - MARIADB_DATABASE=${DB_NAME:-fangemeinschaft}
      - MARIADB_USER=${DB_USER:-fangemeinschaft}
      - MARIADB_PASSWORD=${DB_PASSWORD:-fangemeinschaft}
    volumes:
      - mariadb-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ../dist:/usr/share/nginx/html:ro
    depends_on:
      - app
    networks:
      - app-network

volumes:
  mariadb-data:
    driver: local

networks:
  app-network:
    driver: bridge
```

## Production Configuration (`deployment/docker-compose.prod.yml`)

The production configuration extends the base configuration with production-specific settings:

```yaml
version: '3.8'

services:
  app:
    build:
      context: ..
      dockerfile: deployment/Dockerfile.prod
    environment:
      - NODE_ENV=production
    expose:
      - "3000"
    networks:
      - npm_network
      - app-network

  db:
    environment:
      - MARIADB_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MARIADB_DATABASE=${DB_NAME}
      - MARIADB_USER=${DB_USER}
      - MARIADB_PASSWORD=${DB_PASSWORD}

  npm:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
      - '81:81'
    environment:
      DB_MYSQL_HOST: "db"
      DB_MYSQL_PORT: 3306
      DB_MYSQL_USER: ${DB_USER}
      DB_MYSQL_PASSWORD: ${DB_PASSWORD}
      DB_MYSQL_NAME: ${DB_NAME}
    volumes:
      - npm_data:/data
      - npm_letsencrypt:/etc/letsencrypt
    depends_on:
      - db
    networks:
      - npm_network
      - app-network

volumes:
  npm_data:
    driver: local
  npm_letsencrypt:
    driver: local

networks:
  npm_network:
    external: true
```

## Environment Configuration

### Development (.env)
```env
DB_USER=fangemeinschaft
DB_PASSWORD=fangemeinschaft
DB_NAME=fangemeinschaft
MYSQL_ROOT_PASSWORD=rootpassword
```

### Production (.env.prod)
```env
DB_USER=secure-user
DB_PASSWORD=secure-password
DB_NAME=fangemeinschaft
MYSQL_ROOT_PASSWORD=secure-root-password
```

## Usage

### Development
```bash
# Start development environment
docker-compose -f deployment/docker-compose.yml up -d

# View logs
docker-compose -f deployment/docker-compose.yml logs -f

# Stop services
docker-compose -f deployment/docker-compose.yml down
```

### Production
```bash
# Start production environment using build.sh
./build.sh

# Or manually:
docker-compose -f deployment/docker-compose.prod.yml --env-file .env.prod up -d
```

## Key Differences

### Development vs Production

1. **Application Container**
   - Development: Uses development Dockerfile with hot reloading
   - Production: Uses production Dockerfile with optimized build

2. **Nginx Configuration**
   - Development: Basic reverse proxy
   - Production: Nginx Proxy Manager with SSL/TLS support

3. **Environment Variables**
   - Development: Default values for local use
   - Production: Secure production credentials

4. **Networks**
   - Development: Single internal network
   - Production: Additional network for Nginx Proxy Manager

## Maintenance

### Database Operations
```bash
# Backup
docker-compose exec db mysqldump -u root -p${MYSQL_ROOT_PASSWORD} ${DB_NAME} > backup.sql

# Restore
docker-compose exec -T db mysql -u root -p${MYSQL_ROOT_PASSWORD} ${DB_NAME} < backup.sql
```

### Updates
```bash
# Update images
docker-compose pull

# Rebuild services
docker-compose up -d --build
```

## Security Considerations

1. **Network Security**
   - Internal networks for services
   - External access only through proxy
   - SSL/TLS encryption in production

2. **Data Security**
   - Volume persistence
   - Backup management
   - Access control

3. **Environment Security**
   - Secure credentials
   - Production overrides
   - Limited exposure

## Troubleshooting

### Common Issues

1. **Database Connection**
```bash
# Check database
docker-compose exec db mysqladmin ping -h localhost
```

2. **Network Issues**
```bash
# Check networks
docker network ls
docker network inspect app-network
```

3. **Container Issues**
```bash
# Check logs
docker-compose logs [service]

# Access shell
docker-compose exec [service] sh
```