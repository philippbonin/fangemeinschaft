# Application Flow Documentation

## Overview

This document describes the two main types of application flows:
1. Unauthenticated User Flow (Public)
2. Authenticated Admin Flow (Protected)

## 1. Unauthenticated User Flow

### Request Flow
1. User makes request to public route (e.g., `/news`, `/matches`)
2. Request hits Astro server
3. Astro routes request to appropriate page component
4. Page component:
   - Fetches required data through utility functions
   - Utility functions call Prisma client
   - Prisma executes database queries
   - Data is returned and rendered
5. Response sent to user

### Code Path Example (News Page)
```
Browser Request
  └─> /news
      └─> src/pages/news/index.astro
          └─> src/utils/news.ts::getNews()
              └─> src/lib/prisma.ts
                  └─> Database
                      └─> Response
```

### Key Characteristics
- No authentication required
- Read-only access
- Public data only
- Cached responses where possible
- Static page generation for performance

### Available Public Routes
- `/` - Homepage
- `/news` - News articles
- `/matches` - Match schedules
- `/team` - Team information
- `/fanclubs` - Fanclub listings
- `/about` - Club information
- `/contact` - Contact information

## 2. Authenticated Admin Flow

### Authentication Process
1. Admin visits `/admin/login`
2. Submits credentials
3. Request goes to `/api/auth/login`
4. Authentication flow:
   ```
   Login Request
     └─> src/pages/api/auth/login.ts
         └─> src/lib/auth.ts::createSession()
             └─> Verify credentials
             └─> Generate JWT
             └─> Set secure cookie
             └─> Redirect to admin dashboard
   ```

### Protected Request Flow
1. Admin makes request to protected route
2. Authentication middleware checks JWT token:
   ```
   Admin Request
     └─> Authentication Middleware
         └─> src/lib/auth.ts::isAuthenticated()
             ├─> If valid: Continue to handler
             └─> If invalid: Redirect to login
   ```

3. Request handling:
   ```
   Protected Route
     └─> Validation Middleware
         └─> Business Logic
             └─> Database Operations
                 └─> Response
   ```

### Middleware Chain
```
Request
  └─> Authentication Check
      └─> Request Validation
          └─> Error Handling
              └─> Audit Logging
                  └─> Cache Check
                      └─> Database Operation
```

### Protected Routes
All routes under `/admin/*`:
- `/admin/news/*` - News management
- `/admin/matches/*` - Match management
- `/admin/team/*` - Team management
- `/admin/formation/*` - Formation management
- `/admin/fanclubs/*` - Fanclub management
- `/admin/assets/*` - Asset management
- `/admin/settings/*` - Settings management

### Security Measures
1. Authentication
   - JWT tokens with expiration
   - Secure, HTTP-only cookies
   - CSRF protection
   - Session management

2. Request Validation
   ```typescript
   // src/middleware/validation.ts
   validateRequest(schema)(async (context) => {
     const validatedData = await validate(context.request);
     // Continue with validated data
   });
   ```

3. Error Handling
   ```typescript
   // src/lib/errors.ts
   try {
     // Protected operation
   } catch (error) {
     handlePrismaError(error, model, action);
   }
   ```

4. Audit Logging
   ```typescript
   // src/lib/middleware.ts
   withAuditLog(async (params, next) => {
     // Log operation details
     const result = await next(params);
     // Log result
     return result;
   });
   ```

## Data Flow Examples

### 1. Public News Request
```
GET /news
  └─> src/pages/news/index.astro
      └─> src/utils/news.ts::getNews()
          └─> src/lib/prisma.ts
              └─> Cache Middleware
                  └─> Database Query
                      └─> Render Response
```

### 2. Protected News Creation
```
POST /api/news
  └─> Authentication Check
      └─> src/pages/api/news/index.ts
          └─> Validation Middleware
              └─> src/utils/news.ts::createNews()
                  └─> Audit Logging
                      └─> Database Transaction
                          └─> Redirect Response
```

### 3. Protected Settings Update
```
POST /api/settings
  └─> Authentication Check
      └─> src/pages/api/settings/index.ts
          └─> Validation Middleware
              └─> src/utils/settings.ts::updateSettings()
                  └─> Cache Invalidation
                      └─> Database Update
                          └─> Redirect Response
```

## Error Handling

### Public Routes
- Graceful degradation
- User-friendly error messages
- Fallback content where possible

### Protected Routes
- Detailed error logging
- Transaction rollback
- Audit trail
- Admin notifications

## Performance Considerations

### Public Routes
- Response caching
- Static page generation
- Image optimization
- Lazy loading

### Protected Routes
- Request validation
- Transaction management
- Background processing
- Rate limiting