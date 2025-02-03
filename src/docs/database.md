# Database Documentation

## Overview

The application uses MariaDB as its primary database, with Prisma as the ORM. Database changes are managed through a migration system.

## Database Initialization

### Using init-db.sh

The `deployment/init-db.sh` script handles database initialization:

```bash
# Run initialization script
docker-compose exec app ./deployment/init-db.sh
```

The script performs these steps:
1. Waits for database to be ready
2. Runs all migrations in order
3. Seeds initial data
4. Verifies database setup

### Script Details

The initialization script:
- Checks database connectivity
- Applies migrations from `/supabase/migrations`
- Creates required tables and indexes
- Sets up initial admin user
- Configures default settings

### Error Handling

The script includes error handling:
- Connection retries
- Migration failure recovery
- Detailed error logging
- Rollback on failure

## Database Schema

### Core Tables

1. **Users**
   - Authentication and user management
   - Stores user credentials and profile information

2. **News**
   - Blog posts and announcements
   - Categories and content management

3. **Matches**
   - Game schedules and results
   - Match details and statistics

4. **Fanclubs**
   - Fanclub information and management
   - Member associations

5. **Formations**
   - Team formations for matches
   - Player positions and tactics

6. **Assets**
   - Media file management
   - Image storage and organization

## Migration System

The application uses a robust migration system for database changes. See [Migrations Guide](./migrations.md) for details.

### Key Features
- Version-controlled schema changes
- Rollback capability
- Automatic migration during deployment
- Data preservation
- Security policy management

## Connection Management

Database connections are managed through Prisma Client with connection pooling:

```typescript
// src/lib/prisma.ts
export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});
```

## Security

1. **Row Level Security (RLS)**
   - Enabled for all tables
   - Policy-based access control
   - User-specific data isolation

2. **Authentication**
   - Password hashing
   - Session management
   - JWT tokens

3. **Audit Logging**
   - Track all changes
   - User accountability
   - Change history

## Performance

1. **Indexing Strategy**
   - Primary keys
   - Foreign keys
   - Common query paths

2. **Query Optimization**
   - Prepared statements
   - Query analysis
   - Performance monitoring

3. **Caching**
   - Query results
   - Frequently accessed data
   - Cache invalidation

## Maintenance

1. **Backups**
   - Automated daily backups
   - Point-in-time recovery
   - Backup verification

2. **Monitoring**
   - Query performance
   - Resource usage
   - Error tracking

3. **Optimization**
   - Regular cleanup
   - Index maintenance
   - Query optimization

## Development Workflow

1. **Schema Changes**
   ```bash
   npm run prisma migrate dev
   ```

2. **Database Reset**
   ```bash
   npm run prisma migrate reset
   ```

3. **Generate Client**
   ```bash
   npm run prisma generate
   ```

## Production Deployment

1. **Migration Process**
   - Automatic migration during deployment
   - Rollback capability
   - Data preservation

2. **Monitoring**
   - Performance metrics
   - Error tracking
   - Resource usage

3. **Maintenance**
   - Regular backups
   - Index optimization
   - Query analysis