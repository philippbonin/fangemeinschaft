# Source Code Structure Documentation

## Directory Overview

This document provides a detailed explanation of each file in the `src/` directory, its purpose, and how to extend it.

## Components (`src/components/`)

### Astro Components

1. `AdminBuildLabel.astro`
- Purpose: Displays build information in admin panel
- When to modify: Add new build metadata or change display format
- How to extend: Add new props for additional build information

2. `BuildLabel.astro`
- Purpose: Shows build info on frontend
- When to modify: Change public build info display
- How to extend: Add new build metadata display options

3. `FormationDisplay.astro`
- Purpose: Visualizes team formations
- When to modify: Change formation visualization
- How to extend: Add new formation types or visualization options

4. `Header.astro` & `Footer.astro`
- Purpose: Main navigation and footer components
- When to modify: Update navigation structure or footer content
- How to extend: Add new navigation items or footer sections

5. `NextMatch.astro`
- Purpose: Displays next match information
- When to modify: Change match info display
- How to extend: Add new match details or display options

### React Components (`src/components/react/`)

1. `Button.tsx`
- Purpose: Reusable button component
- When to modify: Update button styles or behavior
- How to extend: Add new button variants or props

2. `Chat.tsx`
- Purpose: Interactive chat widget
- When to modify: Update chat functionality
- How to extend: Add new chat features or integrations

3. `Dialog.tsx`
- Purpose: Modal dialog component
- When to modify: Change dialog behavior or appearance
- How to extend: Add new dialog types or animations

4. `FormationEditor.tsx`
- Purpose: Interactive formation editor
- When to modify: Update editor functionality
- How to extend: Add new formation editing features

## Library (`src/lib/`)

1. `auth.ts`
- Purpose: Authentication logic
- When to modify: Change auth flow or add auth methods
- How to extend: Add new authentication providers

2. `prisma.ts`
- Purpose: Database client configuration
- When to modify: Update database connection or add middleware
- How to extend: Add new database features or optimizations

3. `validation.ts`
- Purpose: Data validation schemas
- When to modify: Update validation rules
- How to extend: Add new validation schemas

4. `errors.ts`
- Purpose: Error handling utilities
- When to modify: Add new error types
- How to extend: Add new error handling strategies

5. `middleware.ts`
- Purpose: Prisma middleware functions
- When to modify: Change database middleware behavior
- How to extend: Add new middleware functions

6. `cache.ts`
- Purpose: Caching functionality
- When to modify: Update caching strategy
- How to extend: Add new caching methods

7. `openapi.ts`
- Purpose: API documentation
- When to modify: Update API specs
- How to extend: Document new endpoints

## Middleware (`src/middleware/`)

1. `validation.ts`
- Purpose: Request validation
- When to modify: Change validation behavior
- How to extend: Add new validation rules

2. `errorHandler.ts`
- Purpose: API error handling
- When to modify: Update error responses
- How to extend: Add new error types

3. `rateLimit.ts`
- Purpose: API rate limiting
- When to modify: Change rate limit rules
- How to extend: Add new rate limiting strategies

## Pages (`src/pages/`)

### Admin Pages (`src/pages/admin/`)
- Purpose: Admin panel routes
- When to modify: Update admin functionality
- How to extend: Add new admin features

### API Routes (`src/pages/api/`)
- Purpose: API endpoints
- When to modify: Update API functionality
- How to extend: Add new endpoints

### Public Pages
- Purpose: Public-facing routes
- When to modify: Update public content
- How to extend: Add new public pages

## Types (`src/types/`)

1. `asset.ts`, `fanclub.ts`, etc.
- Purpose: TypeScript type definitions
- When to modify: Update data structures
- How to extend: Add new types or interfaces

## Utils (`src/utils/`)

1. `auth.ts`, `news.ts`, etc.
- Purpose: Feature-specific utilities
- When to modify: Update feature functionality
- How to extend: Add new utility functions

## Extending the Application

### Adding a New Entity

1. Create type definition:
```typescript
// src/types/newEntity.ts
export interface NewEntity {
  id?: string;
  name: string;
  // ... other fields
}
```

2. Add database model:
```prisma
// prisma/schema.prisma
model NewEntity {
  id        String   @id @default(uuid())
  name      String
  // ... other fields
}
```

3. Create utility functions:
```typescript
// src/utils/newEntity.ts
import { prisma } from '../lib/prisma';

export async function getNewEntities() {
  return prisma.newEntity.findMany();
}
// ... other CRUD functions
```

4. Add API endpoints:
```typescript
// src/pages/api/newEntity/index.ts
export const POST: APIRoute = async ({ request }) => {
  // ... handler logic
};
```

5. Create admin pages:
```typescript
// src/pages/admin/newEntity/index.astro
// ... admin interface
```

### Adding New Features

1. Update types and schema
2. Create utility functions
3. Add API endpoints
4. Create UI components
5. Update documentation
6. Add tests

### Security Considerations

When extending:
1. Validate all inputs
2. Add authentication checks
3. Implement rate limiting
4. Add error handling
5. Update tests
6. Document changes

### Performance Considerations

When adding features:
1. Use caching where appropriate
2. Optimize database queries
3. Implement pagination
4. Use proper indexes
5. Monitor performance impact

## Testing

When extending the application:
1. Add unit tests for new utilities
2. Add API tests for new endpoints
3. Add integration tests for new features
4. Update user journey tests
5. Add accessibility tests

## Documentation

When adding new code:
1. Update API documentation
2. Update deployment docs
3. Update testing docs
4. Add code comments
5. Update README