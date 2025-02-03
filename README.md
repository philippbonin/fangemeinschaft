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
# Database
DATABASE_URL="mysql://fangemeinschaft:fangemeinschaft@localhost:3306/fangemeinschaft"
DB_USER=fangemeinschaft
DB_PASSWORD=fangemeinschaft
DB_NAME=fangemeinschaft
MYSQL_ROOT_PASSWORD=rootpassword

# JWT
JWT_SECRET=your-development-secret

# App
NODE_ENV=development
HOST=0.0.0.0
PORT=3000
```

3. Start the development environment:
```bash
docker-compose -f deployment/docker-compose.yml up -d
```

4. Initialize the database:
```bash
docker-compose exec app ./deployment/init-db.sh
```

The application will be available at:
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- API: http://localhost:3000/api

Default admin credentials:
- Email: admin@fangemeinschaft.de
- Password: 4rfvVGZ/1984

## Project Structure

```
/
├── deployment/          # Deployment configurations
│   ├── docker-compose.yml      # Development compose
│   ├── docker-compose.prod.yml # Production compose
│   ├── Dockerfile             # Development Dockerfile
│   ├── Dockerfile.prod        # Production Dockerfile
│   └── nginx/                 # Nginx configurations
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
docker-compose -f deployment/docker-compose.yml up -d

# Watch logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Database Management

```bash
# Run migrations
docker-compose exec app npx prisma migrate deploy

# Reset database
docker-compose exec app npx prisma migrate reset

# Access database
docker-compose exec db mysql -u fangemeinschaft -pfangemeinschaft fangemeinschaft
```

### 3. Running Tests

```bash
# Run all tests
docker-compose exec app npm test

# Run specific tests
docker-compose exec app npm run test:api
docker-compose exec app npm run test:a11y
```

### 4. Code Changes

The application uses hot reloading in development. Most changes will be reflected immediately without requiring a restart.

For changes requiring a rebuild:
```bash
docker-compose up -d --build app
```

## Configuration Files

### Key files that need adaptation:

1. `.env` - Environment variables
2. `deployment/nginx/conf.d/default.conf` - Nginx configuration
3. `prisma/schema.prisma` - Database schema
4. `src/lib/auth.ts` - Authentication settings

## Troubleshooting

### Common Issues

1. Database Connection Errors
```bash
# Check database status
docker-compose exec db mysqladmin ping -h localhost

# Verify connection
docker-compose exec app npx prisma db push --preview-feature
```

2. Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Fix database permissions
docker-compose exec db mysql -e "GRANT ALL ON fangemeinschaft.* TO 'fangemeinschaft'@'%';"
```

3. Build Issues
```bash
# Clean Docker cache
docker builder prune

# Rebuild without cache
docker-compose build --no-cache
```

## Additional Documentation

Detailed documentation is available in the `src/docs` directory:

- [API Documentation](src/docs/api.md)
- [Database Guide](src/docs/database.md)
- [Deployment Guide](src/docs/deployment.md)
- [Testing Guide](src/docs/testing.md)
- [Codebase Structure](src/docs/codebase-structure.md)
- [Application Flow](src/docs/application-flow.md)
- [Docker Deployment](src/docs/docker-deployment.md)
- [Migrations Guide](src/docs/migrations.md)
- [Prisma Guide](src/docs/prisma.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.