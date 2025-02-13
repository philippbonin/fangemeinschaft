#!/bin/sh

docker-compose -f docker-compose.yml --env-file ../../.env ps
./stop.sh

docker system prune -a --volumes

# Build the Docker images with explicit build arg
docker-compose -f docker-compose.yml --env-file ../../.env build \
   --no-cache

# Start the services
./start.sh
docker image prune -f