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
    else
        echo "Migrations exist. Running deploy..."
        npx prisma migrate deploy
    fi

    node deployment/database/check-user.js
    if [ $? -eq 0 ]; then
        echo "Admin user exists. Skipping seed."
    else
        echo "No admin user found. Seeding database..."
        npx prisma db seed
    fi
    npm run dev
else
    echo "Running in production mode..."
    npx prisma migrate deploy

    node deployment/database/check-user.js
    if [ $? -eq 0 ]; then
        echo "Admin user exists. Skipping seed."
    else
        echo "No admin user found. Seeding database..."
        npx prisma db seed
    fi
    node ./dist/server/entry.mjs
fi




      