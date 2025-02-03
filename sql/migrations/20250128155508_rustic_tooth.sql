-- Create sessions table
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