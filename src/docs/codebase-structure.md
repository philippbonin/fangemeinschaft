# Codebase Structure Documentation

## Overview

This document provides a comprehensive overview of the project's codebase structure, architecture, and functionality.

## Directory Structure

```
/
├── src/                    # Source code
│   ├── components/         # UI Components
│   │   ├── react/         # React components
│   │   └── *.astro        # Astro components
│   ├── lib/               # Core libraries and utilities
│   ├── middleware/        # Middleware functions
│   ├── pages/            # Route components and API endpoints
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── docs/             # Project documentation
├── tests/                # Test files
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── deployment/          # Deployment configurations
```

## Core Directories

### `/src/components`

Contains all UI components split into two categories:
- `react/`: Interactive components built with React
- `*.astro`: Static components built with Astro

Key components:
- `AdminBuildLabel.astro`: Build information display for admin panel
- `BuildLabel.astro`: Build information display for frontend
- `FormationDisplay.astro`: Soccer formation visualization
- `Header.astro`: Main navigation header
- `Footer.astro`: Site footer
- `NextMatch.astro`: Next match information display
- `QuickLinks.astro`: Quick navigation links

React Components:
- `Button.tsx`: Reusable button component
- `Chat.tsx`: Interactive chat widget
- `Dialog.tsx`: Modal dialog component
- `FormationEditor.tsx`: Interactive formation editor

### `/src/lib`

Core libraries and utilities:

- `auth.ts`: Authentication and authorization logic
- `prisma.ts`: Database client with middleware
- `validation.ts`: Data validation schemas
- `errors.ts`: Error handling utilities
- `middleware.ts`: Prisma middleware functions
- `migration.ts`: Database migration utilities

### `/src/middleware`

Application middleware:
- `validation.ts`: Request validation middleware

### `/src/pages`

Routes and API endpoints organized by feature:

```
pages/
├── admin/              # Admin panel routes
├── api/               # API endpoints
│   ├── auth/         # Authentication endpoints
│   ├── news/         # News management
│   ├── matches/      # Match management
│   └── ...
├── matches/          # Match-related pages
├── news/            # News pages
└── team/            # Team-related pages
```

### `/src/types`

TypeScript type definitions:
- `asset.ts`: Asset-related types
- `fanclub.ts`: Fanclub-related types
- `match.ts`: Match-related types
- `news.ts`: News-related types
- `player.ts`: Player-related types
- `settings.ts`: Settings-related types
- `user.ts`: User-related types

### `/src/utils`

Utility functions organized by feature:
- `auth.ts`: Authentication utilities
- `assets.ts`: Asset management
- `fanclubs.ts`: Fanclub management
- `formations.ts`: Formation management
- `matches.ts`: Match management
- `news.ts`: News management
- `nextMatch.ts`: Next match management
- `settings.ts`: Settings management
- `team.ts`: Team management

### `/tests`

Test files organized by type:
- `api/`: API endpoint tests
- `a11y/`: Accessibility tests
- `journeys/`: User journey tests

### `/prisma`

Database configuration:
- `schema.prisma`: Database schema definition
- `migrations/`: Database migrations
- `seed.ts`: Database seeding script

## Key Features

### Authentication
- JWT-based authentication
- Session management
- Password hashing with bcrypt
- Role-based access control

### Database
- Prisma ORM
- MariaDB database
- Migration management
- Data validation
- Audit logging
- Caching middleware

### Frontend
- React components for interactive features
- Astro for static pages
- Tailwind CSS for styling
- Responsive design
- Accessibility features

### API
- RESTful endpoints
- Request validation
- Error handling
- Rate limiting
- CORS configuration

### Testing
- Jest for unit tests
- Puppeteer for E2E tests
- Accessibility testing
- API testing
- User journey testing

## Development Workflow

1. Local Development
   ```bash
   npm run dev        # Start development server
   npm run test       # Run tests
   npm run build     # Build for production
   ```

2. Database Management
   ```bash
   npm run prisma:generate  # Generate Prisma client
   npm run prisma:migrate   # Run migrations
   npm run prisma:seed      # Seed database
   ```

3. Testing
   ```bash
   npm run test:api     # Run API tests
   npm run test:a11y    # Run accessibility tests
   npm run test:watch   # Run tests in watch mode
   ```

## Deployment

The project uses Docker for containerization and includes:
- Production Dockerfile
- Development Dockerfile
- Docker Compose configurations
- Nginx reverse proxy setup
- SSL configuration

## Security Features

1. Authentication
   - JWT tokens
   - Password hashing
   - Session management
   - CSRF protection

2. Database
   - Prepared statements
   - Input validation
   - Audit logging
   - Row-level security

3. API
   - Request validation
   - Rate limiting
   - CORS configuration
   - Error handling

4. Frontend
   - XSS protection
   - CSP headers
   - HTTPS enforcement
   - Secure cookie handling