/*
  # User Management Schema Update

  1. Changes
    - Add firstName and lastName columns to users table
    - Add password column for authentication
    - Add last_login timestamp column
    - Add created_at and updated_at timestamps
    - Add initial admin user

  2. Security
    - Password is stored hashed using bcrypt
    - Enable RLS on users table
    - Add policies for user access
*/

-- Modify users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS firstName VARCHAR(100) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS lastName VARCHAR(100) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS password VARCHAR(255) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Insert initial admin user with hashed password
-- Password: 4rfvVGZ/1984
INSERT INTO users (id, firstName, lastName, email, password)
SELECT 
  UUID(),
  'admin',
  'admin',
  'admin@fangemeinschaft.de',
  '$2a$10$8KzaNdKwZ8nJh.P8RqAIxOYqoMr1yEKPHVP9B.BtGGg5OxWp7Vhji'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@fangemeinschaft.de'
);