# Setup Instructions

Complete guide for setting up and running the Home Library Service.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Docker Setup](#docker-setup)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** (>= 22.14.0) - [Download & Install Node.js](https://nodejs.org/en/download/)
- **npm** - Included with Node.js
- **Git** - [Download & Install Git](https://git-scm.com/downloads)
- **Docker Desktop** (>= 20.x) - [Download & Install Docker](https://www.docker.com/products/docker-desktop/)
- **PostgreSQL** (>= 16) - Only if running without Docker

### System Requirements

- **RAM**: Minimum 4GB, recommended 6GB for Docker
- **Disk Space**: At least 2GB free space
- **OS**: Windows 10/11, macOS, or Linux

---

## Installation

### 1. Clone the Repository

```bash
git clone git@github.com:Bubnov-Roma/nodejs2025Q2-service.git
cd nodejs2025Q2-service
```

### 2. Install Dependencies

```bash
npm install
```

This will automatically:

- Install all Node.js dependencies
- Generate Prisma Client
- Setup TypeScript types

---

## Environment Configuration

### 1. Create Environment Files

Create `.env` file for Docker deployment:

```bash
cp .env.example .env
```

Create `.env.local` file for local development:

```bash
cp .env.example .env.local
```

### 2. Configure Environment Variables

#### For Docker Deployment (`.env`)

```env
# Application
NODE_ENV=development
PORT=4000

# Authentication
CRYPT_SALT=10
JWT_SECRET_KEY=your_secret_key_here
JWT_SECRET_REFRESH_KEY=your_refresh_secret_here
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

# PostgreSQL Configuration
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=home_library

# Prisma Database URL (Docker)
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/home_library?schema=public"


# Clear logs on startup
CLEAR_LOGS_ON_STARTUP=false

# Docker Hub
DOCKER_USERNAME=your_dockerhub_username

# Logging Configuration
LOG_LEVEL=3
MAX_LOG_FILE_SIZE=5120
```

#### For Local Development (`.env.local`)

```env
# Application
NODE_ENV=development
PORT=4000

# Authentication
CRYPT_SALT=10
JWT_SECRET_KEY=your_secret_key_here
JWT_SECRET_REFRESH_KEY=your_refresh_secret_here
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=home_library

# Prisma Database URL (Local)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library?schema=public"


# Clear logs on startup
CLEAR_LOGS_ON_STARTUP=true


# Logging Configuration
LOG_LEVEL=3
MAX_LOG_FILE_SIZE=5120
```

### 3. Security Best Practices

⚠️ **Important**: Change default secrets in production!

```env
# Generate strong secrets
JWT_SECRET_KEY=<generate-random-32-character-string>
JWT_SECRET_REFRESH_KEY=<generate-different-random-32-character-string>
```

You can generate secrets using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Database Setup

### Option 1: Using Docker (Recommended)

Start PostgreSQL container:

```bash
npm run docker:postgres
```

This will:

- Pull PostgreSQL 16 Alpine image
- Create `home-library-postgres` container
- Expose port 5432
- Create persistent volume for data

### Option 2: Local PostgreSQL

1. Install PostgreSQL 16 or higher
2. Create database:

```bash
createdb home_library
```

3. Configure connection in `.env.local`

### Database Migrations

After database is running, apply migrations:

```bash
# For Docker
npm run prisma:migrate

# For local development
npx prisma migrate deploy
```

Verify migration:

```bash
npx prisma studio
```

This opens Prisma Studio at `http://localhost:5555` for database inspection.

---

## Running the Application

### Development Mode (with hot reload)

#### Local Development

```bash
# Start PostgreSQL (if using Docker)
npm run docker:postgres

# Run application
npm run start:dev
```

#### Docker Development

```bash
# Start everything with hot reload
npm run docker:dev
```

Features:

- Hot reload on file changes
- Source code mounted as volume
- Automatic migration on startup
- Logs available in console

### Production Mode

#### Local Production Build

```bash
# Build application
npm run build

# Start production server
npm run start:prod
```

#### Docker Production

```bash
# Build and start production containers
npm run docker:prod

# Or in detached mode
npm run docker:prod:detached
```

### Standard Start

```bash
npm run start
```

---

## Docker Setup

### Quick Start

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env and set DOCKER_USERNAME

# 2. Start in development mode
npm run docker:dev
```

### Available Docker Commands

```bash
# Development with hot reload
npm run docker:dev

# Production mode
npm run docker:prod
npm run docker:prod:detached

# Stop containers
npm run docker:down

# PostgreSQL only
npm run docker:postgres
npm run docker:postgres:down

# Clean up (remove volumes and containers)
npm run docker:clean

# Check image size
npm run docker:size

# Scan for vulnerabilities
npm run docker:scan
```

### Docker Architecture

The application uses multi-stage builds:

1. **Builder Stage**: Installs dependencies and builds application
2. **Production Stage**: Minimal runtime image (~500MB)

Services:

- **app**: NestJS application (port 4000)
- **postgres**: PostgreSQL 16 (port 5432)

Volumes:

- `postgres_data`: Database persistence
- `postgres_logs`: Database logs
- `app_logs`: Application logs

---

## Verification

### 1. Check Application Status

After starting, verify the application:

```bash
curl http://localhost:4000
```

Expected response:

```
Hello World!
```

### 2. Test Authentication

Create a user:

```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"testpass123"}'
```

Login:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"testpass123"}'
```

Expected response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Test Protected Endpoint

Get all users (requires authentication):

```bash
curl http://localhost:4000/user \
  -H "Authorization: Bearer <your_access_token>"
```

### 4. Check Database Connection

```bash
# Open Prisma Studio
npm run prisma:studio
```

Visit `http://localhost:5555` to inspect database.

### 5. Run Tests

```bash
# Without authorization
npm run test

# With authorization
npm run test:auth

# Refresh token tests
npm run test:refresh
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 4000
# Linux/macOS
lsof -ti:4000 | xargs kill -9

# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Docker Issues

#### Out of Memory

1. Increase Docker memory to 6GB:
   - Docker Desktop → Settings → Resources → Memory
   - Set to 6GB
   - Click "Apply & Restart"

2. Close other applications

3. Restart Docker Desktop

#### Build Failures

```bash
# Clean Docker cache
npm run docker:clean

# Rebuild from scratch
npm run docker:build
```

#### Container Won't Start

```bash
# Check logs
docker-compose logs app
docker-compose logs postgres

# Restart services
npm run docker:down
npm run docker:dev
```

### Database Connection Issues

#### Connection Refused

1. Check if PostgreSQL is running:

```bash
# For Docker
docker ps | grep postgres

# For local PostgreSQL
pg_isready -h localhost -p 5432
```

2. Verify DATABASE_URL in `.env`:

```env
# For Docker
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/home_library?schema=public"

# For local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library?schema=public"
```

#### Migration Errors

```bash
# Reset database
npm run docker:clean

# Restart PostgreSQL
npm run docker:postgres

# Apply migrations
npx prisma migrate deploy
```

### Prisma Issues

#### Client Not Generated

```bash
npx prisma generate
```

#### Migration Failed

```bash
# Reset database
npx prisma migrate reset

# Or create new migration
npx prisma migrate dev
```

### Common Errors

#### `Cannot find module '@prisma/client'`

```bash
npm install
npx prisma generate
```

#### `Port 4000 is already allocated`

```bash
# Change port in .env
PORT=4001
```

#### `ECONNREFUSED` when connecting to database

Check if PostgreSQL is running and DATABASE_URL is correct.

### Getting Help

If you encounter issues:

1. Check logs:

   ```bash
   # Application logs
   tail -f logs/app.log
   tail -f logs/error.log

   # Docker logs
   docker-compose logs app
   docker-compose logs postgres
   ```

2. Verify configuration:

   ```bash
   # Check environment variables
   cat .env

   # Check Docker status
   docker ps
   docker-compose ps
   ```

3. See [Troubleshooting Guide](TROUBLESHOOTING.md) for more solutions

4. Check [GitHub Issues](https://github.com/Bubnov-Roma/nodejs2025Q2-service/issues)

---

## Next Steps

After successful setup:

1. **Read API Documentation**: See [API Endpoints](doc/API_ENDPOINTS.md)
2. **Learn Authentication**: See [Authentication Guide](doc/AUTHENTICATION.md)
3. **Run Tests**: See [Testing Guide](doc/TESTING.md)
4. **Explore Architecture**: See [Project Structure](doc/PROJECT_STRUCTURE.md)

---

## Quick Reference

### Essential Commands

```bash
# Local development
npm run start:dev

# Docker development
npm run docker:dev

# Run tests
npm run test
npm run test:auth

# Database management
npm run prisma:studio
npm run prisma:migrate:dev

# Check logs
tail -f logs/app.log

# Clean everything
npm run docker:clean
```

### Default URLs

- **Application**: http://localhost:4000
- **Prisma Studio**: http://localhost:5555
- **PostgreSQL**: localhost:5432

### Default Credentials

- **PostgreSQL**:
  - User: `postgres`
  - Password: `postgres`
  - Database: `home_library`

⚠️ **Change these in production!**
