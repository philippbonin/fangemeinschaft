/*
  # Update assets table to store binary data

  1. Changes
    - Add data column to store binary file content
    - Update existing assets table structure
    
  2. Security
    - Enable RLS on assets table
    - Add policies for authenticated users
*/

-- Add data column to assets table
ALTER TABLE assets
ADD COLUMN IF NOT EXISTS data LONGBLOB;

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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_assets_name ON assets(name);