#!/bin/bash
node scripts/build.js dev
# Start the services
docker-compose -f deployment/docker-compose.yml --env-file .env down
docker-compose -f deployment/docker-compose.yml --env-file .env up -d