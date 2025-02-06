#!/bin/sh

docker-compose -f deployment/docker-compose.yml --env-file .env ps
docker-compose -f deployment/docker-compose.yml --env-file .env down
docker system prune -a --volumes
node scripts/build.js dev

# Build the Docker images with explicit build arg
docker-compose -f deployment/docker-compose.yml --env-file .env build \
   --no-cache

# Start the services
docker-compose -f deployment/docker-compose.yml --env-file .env up -d
docker image prune -f