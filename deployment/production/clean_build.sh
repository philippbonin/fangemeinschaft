#!/bin/sh

docker-compose -f docker-compose.prod.yml --env-file ../../.env.production ps
docker-compose -f docker-compose.prod.yml  --env-file ../../.env.production down
#docker system prune -a --volumes

npm run build
node ../misc/buildLabel.js prod

# Build the Docker images with explicit build arg
docker-compose -f docker-compose.prod.yml  --env-file ../../.env.production build \
   --no-cache

# Start the services
docker-compose -f docker-compose.prod.yml --env-file ../../.env.production up
docker image prune -f


