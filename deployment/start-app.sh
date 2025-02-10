#!/bin/sh

# Wait for the database to be ready
while [ ! -f /var/lib/mysql/db_ready ]; do 
  sleep 2
done
echo "Database is ready! Checking for existing migrations..."

# Generate Prisma client
npx prisma generate

# Get migration status
MIGRATION_STATUS=$(npx prisma migrate status --schema=prisma/schema.prisma | grep 'No migration found')

if [ "$NODE_ENV" = "development" ]; then
    if [ -n "$MIGRATION_STATUS" ]; then
        echo "No migrations found. Initializing database..."
        npx prisma migrate dev --name init
        npx prisma db seed
    else
        echo "Migrations exist. Running deploy..."
        npx prisma migrate deploy
    fi
    npm run dev
else
    echo "Running in production mode..."
    npx prisma migrate deploy
    npm run start
fi



      