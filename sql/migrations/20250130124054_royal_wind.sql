-- Add build label settings to settings table
ALTER TABLE settings
ADD COLUMN IF NOT EXISTS build_label_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS build_name VARCHAR(100);

-- Update existing settings rows
UPDATE settings 
SET build_label_enabled = TRUE,
    build_name = 'unnamed'
WHERE build_label_enabled IS NULL;