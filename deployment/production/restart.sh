#!/bin/bash

# Start the services
docker-compose -f docker-compose.prod.yml --env-file ../../.env.production down
docker-compose -f docker-compose.prod.yml --env-file ../../.env.production up