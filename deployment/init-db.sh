#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
max_retries=30
retry_count=0

while ! mariadb-admin ping -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" --silent; do
    retry_count=$((retry_count+1))
    if [ $retry_count -eq $max_retries ]; then
        echo "Failed to connect to database after $max_retries attempts"
        exit 1
    fi
    echo "Attempt $retry_count of $max_retries: Database not ready yet..."
    sleep 2
done

echo "Database is ready. Running Prisma seed..."

# Generate Prisma Client (only done once here)
# npx prisma generate

# Run migrations
#npx prisma migrate deploy

#Run seed if in development
if [ "$NODE_ENV" = "development" ]; then
    echo "Development environment detected. Running seeds..."
    npx prisma db seed
fi

echo "Database initialization completed successfully."