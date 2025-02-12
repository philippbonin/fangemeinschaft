#!/bin/bash

# Start the services
docker-compose -f docker-compose.yml --env-file ../../.env down
docker-compose -f docker-compose.yml --env-file ../../.env up