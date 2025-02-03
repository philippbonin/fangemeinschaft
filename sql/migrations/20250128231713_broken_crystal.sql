/*
  # Complete Database Schema

  1. Tables
    - users: User management and authentication
    - sessions: Session handling
    - news: News articles
    - players: Team players
    - matches: Match information
    - fanclubs: Fan club details
    - formations: Team formations
    - formation_players: Player positions in formations
    - assets: Media assets
    - next_match: Current next match
    - next_match_history: History of next matches
    - settings: Application settings

  2. Security
    - Row Level Security (RLS) enabled on users table
    - Policies for user data access
    - Password hashing for user authentication

  3. Indexes
    - Optimized queries with appropriate indexes
    - Foreign key relationships
*/

-- Enable foreign key constraints
SET FOREIGN_KEY_CHECKS = 1;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  date DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (date)
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  number INT NOT NULL,
  position VARCHAR(50) NOT NULL,
  image VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id VARCHAR(36) PRIMARY KEY,
  date DATETIME NOT NULL,
  competition VARCHAR(100) NOT NULL,
  home_team VARCHAR(100) NOT NULL,
  away_team VARCHAR(100) NOT NULL,
  home_score INT,
  away_score INT,
  venue VARCHAR(100) NOT NULL,
  played BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (date)
);

-- Create fanclubs table
CREATE TABLE IF NOT EXISTS fanclubs (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  president VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  mobile VARCHAR(50),
  email VARCHAR(100) NOT NULL,
  website VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create formations table
CREATE TABLE IF NOT EXISTS formations (
  id VARCHAR(36) PRIMARY KEY,
  match_id VARCHAR(36) NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  INDEX idx_match (match_id)
);

-- Create formation_players table
CREATE TABLE IF NOT EXISTS formation_players (
  id VARCHAR(36) PRIMARY KEY,
  formation_id VARCHAR(36) NOT NULL,
  player_id VARCHAR(36) NOT NULL,
  position_x DECIMAL(5,2) NOT NULL,
  position_y DECIMAL(5,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  INDEX idx_formation (formation_id),
  INDEX idx_player (player_id)
);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create next_match table
CREATE TABLE IF NOT EXISTS next_match (
  id VARCHAR(36) PRIMARY KEY,
  match_id VARCHAR(36) NOT NULL,
  ticket_link VARCHAR(255),
  more_info_content TEXT,
  active BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  INDEX idx_active (active)
);

-- Create next_match_history table
CREATE TABLE IF NOT EXISTS next_match_history (
  id VARCHAR(36) PRIMARY KEY,
  match_id VARCHAR(36) NOT NULL,
  ticket_link VARCHAR(255),
  more_info_content TEXT,
  activated_at DATETIME NOT NULL,
  deactivated_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id VARCHAR(36) PRIMARY KEY,
  logo_url VARCHAR(255) NOT NULL,
  chat_enabled BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create user access policies
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

-- Insert initial admin user
-- Password: 4rfvVGZ/1984 (bcrypt hashed)
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

-- Insert initial settings
INSERT INTO settings (id, logo_url, chat_enabled)
SELECT
  UUID(),
  '/fangemeinschaftLogo.png',
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM settings
);