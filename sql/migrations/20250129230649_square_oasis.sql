-- Drop old assets table
DROP TABLE IF EXISTS assets;

-- Create new assets table with binary storage
CREATE TABLE assets (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  data LONGBLOB NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_assets_name (name)
);

-- Enable RLS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Assets are readable by everyone"
  ON assets
  FOR SELECT
  USING (true);

CREATE POLICY "Assets are insertable by authenticated users"
  ON assets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Assets are deletable by authenticated users"
  ON assets
  FOR DELETE
  TO authenticated
  USING (true);