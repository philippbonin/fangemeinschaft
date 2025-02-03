-- Enable foreign key constraints
SET FOREIGN_KEY_CHECKS = 1;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create sessions table for auth sessions
CREATE TABLE IF NOT EXISTS sessions (
  token VARCHAR(36) PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  INDEX idx_token (token),
  INDEX idx_expires (expires_at)
);

-- Insert initial admin user if not exists
INSERT IGNORE INTO users (id, email) 
VALUES (UUID(), 'admin@fangemeinschaft.de');