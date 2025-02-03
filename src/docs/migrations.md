# Database Migrations Guide

## Overview

The Fangemeinschaft application uses a robust migration system to manage database schema changes. This document explains how to use migrations effectively.

## Migration System Components

1. **Migration Files**
   - Located in `/supabase/migrations/`
   - Named with timestamp and description (e.g., `20250202180046_withered_ocean.sql`)
   - Contains SQL for schema changes

2. **Migration Library**
   - Located in `src/lib/migration.ts`
   - Provides utilities for running and rolling back migrations

3. **Docker Integration**
   - Migrations run during container startup
   - Uses `deployment/init-db.sh`

## Using Migrations

### 1. Creating Migrations

```bash
# Generate new migration
npm run prisma migrate dev -- --name descriptive_name
```

Migration file structure:
```sql
-- Description block
/*
  # Migration Title
  
  1. Changes
    - Added new table
    - Modified existing columns
  
  2. Security
    - Added RLS policies
*/

-- Schema changes
CREATE TABLE IF NOT EXISTS new_table (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Security policies
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
```

### 2. Running Migrations

#### Development Environment
```bash
# Run all pending migrations
npm run prisma migrate deploy

# Reset database and rerun all migrations
npm run prisma migrate reset
```

#### Production Environment
Migrations run automatically during container startup via `init-db.sh`:
```bash
docker-compose exec app ./deployment/init-db.sh
```

### 3. Rolling Back Migrations

Using the migration library:
```typescript
import { rollbackMigration } from '../lib/migration';

await rollbackMigration(prisma, '20250202180046_withered_ocean');
```

## Best Practices

1. **Migration Content**
   - One logical change per migration
   - Include rollback logic
   - Use IF EXISTS/IF NOT EXISTS
   - Add proper indexes
   - Enable RLS for new tables

2. **Documentation**
   - Clear description comments
   - List all changes
   - Document security implications
   - Include example data if needed

3. **Safety**
   - Backup before migrating
   - Test migrations locally
   - Use transactions
   - Handle errors gracefully

## Example Migration

```sql
/*
  # Add User Preferences
  
  1. Changes
    - Added user_preferences table
    - Added foreign key to users table
  
  2. Security
    - RLS policies for user access
    - Audit logging enabled
*/

-- Create preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  theme VARCHAR(20) DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can read own preferences"
  ON user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
```

## Troubleshooting

### Common Issues

1. **Migration Failed**
```bash
# Check migration status
npm run prisma migrate status

# Reset database
npm run prisma migrate reset
```

2. **Conflict Resolution**
```bash
# Reset migration history
npm run prisma migrate reset -- --force

# Apply migrations fresh
npm run prisma migrate deploy
```

3. **Data Loss Prevention**
```sql
-- Check for existing data
DO $$ 
BEGIN 
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'old_column'
  ) THEN
    -- Migrate data before dropping
    UPDATE users 
    SET new_column = old_column;
  END IF;
END $$;
```

## Integration with Build Process

The migration system integrates with the build process through `scripts/build.js`:

```javascript
// scripts/build.js
import { runMigrations } from '../src/lib/migration';

async function build() {
  try {
    // Run migrations first
    await runMigrations(prisma);
    
    // Continue with build
    // ...
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}
```

## Monitoring and Maintenance

1. **Migration History**
```sql
SELECT * FROM _prisma_migrations 
ORDER BY finished_at DESC;
```

2. **Performance Impact**
```sql
EXPLAIN ANALYZE 
SELECT * FROM new_table 
WHERE column = 'value';
```

3. **Audit Trail**
```sql
SELECT * FROM audit_log 
WHERE table_name = 'new_table' 
ORDER BY timestamp DESC;
```