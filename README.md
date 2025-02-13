# Fangemeinschaft Local Development Setup

## Prerequisites

- Docker Engine 24.0+
- Docker Compose 2.0+
- Git
- Node.js 18+ (optional, for local development without Docker)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-org/fangemeinschaft.git
cd fangemeinschaft
```

2. Create environment files:

Create `.env` file in the project root:
```env
DB_USER= <<ENTER SOMETHING>>
DB_PASSWORD= <<ENTER SOMETHING>>
DB_NAME= <<ENTER SOMETHING>>
DB_HOST=fangemeinschaft-dev-db
MARIADB_SSL=OFF
MYSQL_ROOT_PASSWORD= <<ENTER SOMETHING>>
max_allowed_packet=64M
wait_timeout=600
interactive_timeout=600
net_read_timeout=600
net_write_timeout=600
JWT_SECRET= <<ENTER SOMETHING>>
NODE_ENV=development
PRISMA_CLIENT_ENGINE_TYPE=binary
PRISMA_CLI_ENGINE_TYPE=binary
NODE_OPTIONS="--openssl-legacy-provider"
DATABASE_URL="mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:3306/${DB_NAME}"

```
2. install dependencies
run in root directory
```
npm install
```

3. Start the development environment:
```bash
cd deployment/development/
chmod +x clean_restart.sh restart.sh start.sh stop.sh
./start.sh
```

The application will be available at:
- Frontend: http://localhost:3001
- Admin Panel: http://localhost:3001/admin
- API: http://localhost:3001/api

Default admin credentials:
- Email: admin@fangemeinschaft.de
- Password: 4rfvVGZ/1984

## Project Structure

1️⃣ Core Application Logic
📌 src/lib/auth.ts → Authentication handling with JWT
📌 src/lib/middleware.ts → Prisma middleware and request flow
📌 src/lib/prisma.ts → Prisma client configuration
📌 src/lib/errors.ts → Error management
📌 src/lib/validation.ts → Validation schemas (Zod)
📌 src/lib/cache.ts (if caching is used) → Handles Redis or in-memory caching (if applicable)
2️⃣ Middleware Files
📌 src/middleware/errorHandler.ts → Global error handling
📌 src/middleware/validation.ts → Middleware validation logic
📌 src/middleware/rateLimit.ts → Rate-limiting logic for security
3️⃣ API Routes
📌 src/pages/api/auth/login.ts → Handles user authentication (JWT generation)
📌 src/pages/api/auth/logout.ts → Clears authentication state
📌 src/pages/api/news/index.ts → Example API for handling protected CRUD operations
📌 src/pages/api/events/index.ts (if recently added) → Handles event management
📌 src/pages/api/settings/index.ts → Application settings management (protected route)
4️⃣ Astro-Specific Components & Layouts
📌 src/layouts/Layout.astro → Base layout for application
📌 src/layouts/AdminLayout.astro → Layout for admin-protected pages
📌 src/components/react/CookieConsent.tsx → Ensures cookie compliance with JWT handling
5️⃣ Prisma Schema & Database
📌 prisma/schema.prisma → Prisma ORM schema (DB structure)
📌 prisma/seed.ts → Initial database seeding logic
📌 prisma/migrations/ → Database migrations for schema changes
6️⃣ Configuration & Deployment
📌 astro.config.mjs → Astro app configuration
📌 deployment/nginx/conf.d/default.conf → Nginx reverse proxy settings
📌 deployment/docker-compose.yml → Docker setup including MariaDB and app container
📌 .env (if possible, sanitized version) → Environment variables setup for DB and JWT

Application
    ↓
src/lib/prisma.ts (Prisma Client)
    ↓
prisma/schema.prisma (Schema Definition)
    ↓
.env (DATABASE_URL)
    ↓
Database


```
/
├── deployment/          # Deployment/shipping to prod configurations
├── prisma/             # Database configurations
│   ├── schema.prisma          # Database schema
│   ├── migrations/           # Database migrations
│   └── seed.ts               # Database seeding
├── src/               # Application source
│   ├── components/          # UI Components
│   ├── lib/                # Core libraries
│   ├── pages/             # Routes and API
│   └── utils/            # Utilities
└── tests/             # Test files
```

## Development Workflow

### 1. Starting the Environment

```bash
# Start all services
./deployment/development/start.sh

# Stop services
./deployment/development/stop.sh
```

### 2. Code Changes

The application uses hot reloading in development. Most changes will be reflected immediately without requiring a restart.

For changes requiring a rebuild:
```bash
./deployment/development/clean_start.sh
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.