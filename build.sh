#!/bin/bash

# Start the services
docker-compose -f deployment/docker-compose.prod.yml --env-file .env.prod up -d