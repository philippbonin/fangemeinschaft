#!/bin/bash
npm run build
node ../misc/buildLabel.js prod
# Start the services
docker-compose -f docker-compose.prod.yml --env-file ../../.env.production down
docker-compose -f docker-compose.prod.yml --env-file ../../.env.production up
