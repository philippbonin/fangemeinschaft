# Prisma Configuration Documentation

## Overview

The project uses Prisma as the ORM (Object-Relational Mapping) tool for database management. This document explains the Prisma setup, configuration, and usage.

## Directory Structure

```
prisma/
├── schema.prisma        # Database schema definition
├── migrations/         # Database migrations
└── seed.ts            # Database seeding script
```

## Schema Configuration

The `schema.prisma` file defines the database schema and client configuration:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Models

The schema defines all database models with their relationships and fields. Key models include:

1. **User**
   - Authentication and user management
   - Stores user credentials and profile information
   - Includes password hashing and session management

2. **News**
   - Blog posts and announcements
   - Categories and content management
   - Image handling

3. **Match**
   - Game schedules and results
   - Match details and statistics
   - Venue information

4. **Formation**
   - Team formations for matches
   - Player positions
   - Active formation tracking

5. **Asset**
   - Media file management
   - Binary data storage
   - MIME type handling

## Database Seeding

The `seed.ts` script provides initial data for development and testing:

```typescript
// prisma/seed.ts
async function seed() {
  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@fangemeinschaft.de' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@fangemeinschaft.de',
      password: hashedPassword
    }
  });

  // Create initial settings
  await prisma.settings.upsert({
    where: { id: '1' },
    update: {},
    create: {
      logoUrl: '/fangemeinschaftLogo.png',
      chatEnabled: true,
      buildLabelEnabled: true
    }
  });
}
```

### Running Seeds
```bash
# Run database seeding
npm run prisma:seed

# Reset database and run seeds
npm run prisma:reset
```

## Usage in Application

### Client Instance

The Prisma client is instantiated in `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});
```

### Middleware

Prisma middleware is used for:
1. Logging
2. Error handling
3. Performance monitoring
4. Soft deletes
5. Audit logging

Example middleware:
```typescript
prisma.$use(async (params, next) => {
  const start = performance.now();
  const result = await next(params);
  const duration = performance.now() - start;
  
  if (duration > 100) {
    console.warn(`Slow query in ${params.model}.${params.action}`);
  }
  
  return result;
});
```

## Development Workflow

### 1. Schema Changes

When modifying the database schema:

```bash
# Generate Prisma client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Apply migrations
npm run prisma:migrate deploy
```

### 2. Database Management

```bash
# Open Prisma Studio
npm run prisma:studio

# Reset database
npm run prisma:reset
```

### 3. Type Generation

Prisma automatically generates TypeScript types based on your schema:

```typescript
import type { User, News, Match } from '@prisma/client';
```

## Testing

### 1. Mocking

The test setup uses `jest-mock-extended` to mock Prisma:

```typescript
// tests/setup.ts
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

export const prismaMock = mockDeep<PrismaClient>();

jest.mock('../src/lib/prisma', () => ({
  prisma: prismaMock
}));
```

### 2. Test Database

For integration tests, use a separate test database:

```env
# .env.test
DATABASE_URL="mysql://test:test@localhost:3306/test_db"
```

## Best Practices

1. **Schema Design**
   - Use appropriate field types
   - Add proper indexes
   - Define relationships
   - Include constraints

2. **Migrations**
   - One change per migration
   - Include rollback logic
   - Test migrations
   - Document changes

3. **Error Handling**
   - Use try-catch blocks
   - Handle unique constraints
   - Validate input data
   - Log errors properly

4. **Performance**
   - Use proper indexes
   - Optimize queries
   - Monitor slow queries
   - Use transactions

5. **Security**
   - Hash passwords
   - Use prepared statements
   - Enable RLS
   - Audit sensitive operations

## Common Operations

### 1. CRUD Operations

```typescript
// Create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'User'
  }
});

// Read
const users = await prisma.user.findMany({
  where: {
    active: true
  }
});

// Update
const updated = await prisma.user.update({
  where: { id },
  data: { name: 'New Name' }
});

// Delete
const deleted = await prisma.user.delete({
  where: { id }
});
```

### 2. Relationships

```typescript
// Include related data
const match = await prisma.match.findUnique({
  where: { id },
  include: {
    formation: {
      include: {
        players: true
      }
    }
  }
});
```

### 3. Transactions

```typescript
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ ... });
  const profile = await tx.profile.create({ ... });
  return { user, profile };
});
```

## Environment Setup

Required environment variables:

```env
# .env
DATABASE_URL="mysql://user:password@localhost:3306/database"
```

## Troubleshooting

1. **Connection Issues**
   - Check DATABASE_URL
   - Verify database running
   - Check network access
   - Validate credentials

2. **Migration Errors**
   - Check migration history
   - Verify schema changes
   - Check for conflicts
   - Review error logs

3. **Performance Issues**
   - Monitor query times
   - Check indexes
   - Review relations
   - Optimize queries