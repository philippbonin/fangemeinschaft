-- Ensure the database exists
CREATE DATABASE IF NOT EXISTS fangemeinschaft;

-- Ensure the user exists
CREATE USER IF NOT EXISTS 'fangemeinschaft'@'%' IDENTIFIED BY 'HKh7Ku3K';

-- Grant full privileges to the user
GRANT ALL PRIVILEGES ON *.* TO 'fangemeinschaft'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;