#!/bin/bash
set -e

if [ -f "/var/lib/mysql/db_initialized" ]; then
    echo "Database already initialized. Skipping setup."
    exit 0
fi

echo "Waiting for MariaDB to be fully ready..."

max_retries=30
retry_count=0

while ! mysqladmin ping -h"localhost" --socket="/run/mysqld/mysqld.sock" -u root -p"$MYSQL_ROOT_PASSWORD" --silent; do
    retry_count=$((retry_count+1))
    if [ $retry_count -eq $max_retries ]; then
        echo "Failed to connect to MariaDB after $max_retries attempts."
        exit 1
    fi
    echo "Attempt $retry_count of $max_retries: Database not ready yet..."
    sleep 2
done

# Ensure the database exists
echo "Creating database if not exists..."
mariadb -uroot -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

# Ensure the user exists
echo "Ensuring user exists..."
mariadb -uroot -p"$MYSQL_ROOT_PASSWORD" -e "
CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO '$DB_USER'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;"

echo "User '$DB_USER' now has full access to '$DB_NAME'."
echo "Database is fully ready!"

# Signal thas DB is ready!
touch /var/lib/mysql/db_ready
chown mysql:mysql /var/lib/mysql/db_ready  # Ensure correct ownership
chmod 644 /var/lib/mysql/db_ready 

    