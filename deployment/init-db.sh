#!/bin/bash

# Wait for database to be ready
echo "Waiting for database to be ready..."
max_retries=30
retry_count=0

while ! mysqladmin ping -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" --silent; do
    retry_count=$((retry_count+1))
    if [ $retry_count -eq $max_retries ]; then
        echo "Failed to connect to database after $max_retries attempts"
        exit 1
    fi
    echo "Attempt $retry_count of $max_retries: Database not ready yet..."
    sleep 2
done

echo "Database is ready. Running migrations..."

# Function to run a migration file
run_migration() {
    local migration_file=$1
    echo "Running migration: $migration_file"
    
    # Extract just the filename without path for logging
    local filename=$(basename "$migration_file")
    
    # Run the migration and capture any errors
    if mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$migration_file" 2>/tmp/migration_error; then
        echo "✓ Successfully applied migration: $filename"
        return 0
    else
        echo "✗ Failed to apply migration: $filename"
        echo "Error:"
        cat /tmp/migration_error
        return 1
    fi
}

# Get all migration files and sort them
migration_files=($(ls -v /app/supabase/migrations/*.sql))

# Run each migration in order
for migration_file in "${migration_files[@]}"; do
    if ! run_migration "$migration_file"; then
        echo "Migration failed. Stopping initialization."
        exit 1
    fi
done

echo "All migrations completed successfully."

# Verify database setup
echo "Verifying database setup..."
if mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SHOW TABLES;" > /dev/null; then
    echo "Database verification successful."
else
    echo "Database verification failed."
    exit 1
fi

echo "Database initialization completed successfully."