/*
  # Add expires_at column to sessions table

  1. Changes
    - Add expires_at column to sessions table for session expiration tracking
    - Add index on expires_at for efficient cleanup of expired sessions
*/

-- Add expires_at column if it doesn't exist
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP NOT NULL DEFAULT DATE_ADD(NOW(), INTERVAL 8 HOUR);

-- Add index for expires_at if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);