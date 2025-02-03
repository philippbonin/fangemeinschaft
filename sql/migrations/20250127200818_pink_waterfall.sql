-- Initialize database schema

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
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
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
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
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
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
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

-- Create indexes
CREATE INDEX idx_news_date ON news(date);
CREATE INDEX idx_matches_date ON matches(date);
CREATE INDEX idx_formations_match_id ON formations(match_id);
CREATE INDEX idx_formation_players_formation_id ON formation_players(formation_id);
CREATE INDEX idx_formation_players_player_id ON formation_players(player_id);
CREATE INDEX idx_next_match_active ON next_match(active);

-- Insert initial admin user
INSERT INTO users (id, email) VALUES (
  UUID(),
  'admin@fangemeinschaft.de'
);

-- Insert initial settings
INSERT INTO settings (id, logo_url, chat_enabled) VALUES (
  UUID(),
  '/fangemeinschaftLogo.png',
  TRUE
);