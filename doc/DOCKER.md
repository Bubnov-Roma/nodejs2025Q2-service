# Docker Guide

Complete Docker configuration and deployment guide for Home Library Service.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Docker Images](#docker-images)
- [Configuration](#configuration)
- [Docker Compose](#docker-compose)
- [Commands Reference](#commands-reference)
- [Optimization](#optimization)
- [Troubleshooting](#troubleshooting)

---

## Overview

This project provides two Docker configurations:

- **Development** (`Dockerfile.dev`) - For local development with hot reload
- **Production** (`Dockerfile.prod`) - Optimized multi-stage build for deployment

### Architecture

```
┌─────────────────────────────────────┐
│        Docker Compose Network       │
│                                     │
│  ┌──────────────┐  ┌─────────────┐  │
│  │              │  │             │  │
│  │  PostgreSQL  │◄─┤  NestJS App │  │
│  │  (postgres)  │  │   (app)     │  │
│  │              │  │             │  │
│  └──────────────┘  └─────────────┘  │
│         │                  │        │
│    Port 5432          Port 4000     │
└─────────────────────────────────────┘
```

---

## Quick Start

### Development Mode

```bash
# Start with hot reload
npm run docker:dev

# Application available at http://localhost:4000
```

### Production Mode

```bash
# Build and start
npm run docker:prod

# Or start in background
npm run docker:prod:detached
```

### Stop Services

```bash
npm run docker:down
```

---

## Docker Images

### Development Image (`home-library-app:dev`)

**Size**: ~700MB  
**Purpose**: Local development  
**Features**:

- Full development dependencies
- TypeScript, ESLint, Jest
- Source code hot reload
- Debugging tools

**Build**:

```bash
docker-compose -f docker-compose.dev.yml build
```

**Dockerfile**: `Dockerfile.dev`

---

### Production Image (`home-library-app:latest`)

**Size**: ~400MB (< 500MB)  
**Purpose**: Production deployment  
**Features**:

- Multi-stage build
- Only runtime dependencies
- Compiled JavaScript
- Security hardening

**Build**:

```bash
npm run docker:build
```

**Dockerfile**: `Dockerfile`

---

## Configuration

### Environment Variables

Create `.env` and `.env.local` files:

```env
# Application
NODE_ENV=development
PORT=4000

# Authentication
JWT_SECRET_KEY=your_secret_key
JWT_SECRET_REFRESH_KEY=your_refresh_key
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h
CRYPT_SALT=10

# PostgreSQL

POSTGRES_HOST=postgres (for Docker)

or
POSTGRES_HOST=postgres (for Local)

POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=home_library

# Database URL
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/home_library?schema=public" (for Docker)

or
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library?schema=public" (for Local)

# Logging Configuration
# 0 - no logs
# 1 - error only
# 2 - error, warn
# 3 - error, warn, log (default)
# 4 - error, warn, log, debug
# 5 - all (error, warn, log, debug, verbose)
LOG_LEVEL=3
MAX_LOG_FILE_SIZE=5120

# Docker Hub
DOCKER_USERNAME=kilkun

# Clear logs on startup
CLEAR_LOGS_ON_STARTUP=false (for Docker)

or
CLEAR_LOGS_ON_STARTUP=true (for Local)
```

**Note**: Use different `.env` for Docker vs local development:

- `.env` - For Docker (host: `postgres`)
- `.env.local` - For local (host: `localhost`)

---

## Docker Compose

### Three Compose Files

#### 1. `docker-compose.yml` (Production)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    # Full PostgreSQL setup

  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: ${DOCKER_USERNAME}/home-library-app:latest
    # Production app setup
```

**Usage**: `npm run docker:prod`

---

#### 2. `docker-compose.dev.yml` (Development)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    # PostgreSQL setup

  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    # Development setup with volume mounts
    volumes:
      - ./src:/app/src # Hot reload
```

**Usage**: `npm run docker:dev`

---

#### 3. `docker-compose.postgres.yml` (Database Only)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    # Standalone PostgreSQL
```

**Usage**: `npm run docker:postgres`

---

### Networks

Custom bridge networks for service isolation:

- **Production**: `home-library-network`
- **Development**: `home-library-network-dev`

Services communicate using service names:

```yaml
# App connects to PostgreSQL using:
DATABASE_URL="postgresql://user:pass@postgres:5432/db"
#                                    ^^^^^^^^
#                                 Service name
```

---

### Volumes

Persistent data storage:

```yaml
volumes:
  postgres_data: # PostgreSQL database files
  postgres_logs: # PostgreSQL logs
  app_logs: # Application logs
```

**Development only**:

```yaml
volumes:
  - ./src:/app/src # Source code hot reload
  - /app/node_modules # Prevent override
```

---

### Health Checks

#### PostgreSQL Health Check

```yaml
healthcheck:
  test: ['CMD-SHELL', 'pg_isready -U postgres -d home_library']
  interval: 10s
  timeout: 5s
  retries: 5
  start_period: 10s
```

#### Application Health Check

```yaml
healthcheck:
  test: ['CMD', 'node', '-e', "require('http').get('http://localhost:4000/')"]
  interval: 30s
  timeout: 3s
  start_period: 40s
```

---

## Commands Reference

### Build Commands

```bash
# Safe build with checks
npm run docker:build

# Quick build (uses cache)
npm run docker:build:fast

# Build development image
docker-compose -f docker-compose.dev.yml build
```

### Run Commands

```bash
# Development mode
npm run docker:dev

# Production mode
npm run docker:prod
npm run docker:prod:detached  # Background

# PostgreSQL only
npm run docker:postgres

# Custom
docker-compose up
docker-compose up -d  # Detached
```

### Stop Commands

```bash
# Stop all services
npm run docker:down

# Stop PostgreSQL only
npm run docker:postgres:down

# Force stop and remove
docker-compose down --remove-orphans
```

### Maintenance Commands

```bash
# View logs
docker-compose logs
docker-compose logs -f         # Follow
docker-compose logs app        # Specific service
docker-compose logs --tail=100 # Last 100 lines

# Check status
docker-compose ps

# Execute commands in container
docker-compose exec app sh
docker-compose exec postgres psql -U postgres

# Restart services
docker-compose restart
docker-compose restart app     # Specific service
```

### Image Management

```bash
# List images
docker images

# Check image sizes
npm run docker:size

# Analyze image contents
npm run docker:analyze

# Remove images
docker rmi home-library-app:dev
docker rmi home-library-app:latest

# Push to Docker Hub
npm run docker:push
```

### Cleanup Commands

```bash
# Clean project volumes
npm run docker:clean

# Remove all unused Docker resources
npm run docker:prune

# Remove specific volumes
docker volume rm home-library-postgres-data
docker volume ls  # List volumes
```

---

## Optimization

### Production Build Optimization

The production Dockerfile uses a multi-stage build:

#### Stage 1: Builder

```dockerfile
FROM node:24-alpine AS builder

# Install dependencies and build
RUN npm ci --prefer-offline
RUN npm run build
RUN npm prune --omit=dev
```

#### Stage 2: Production

```dockerfile
FROM node:24-alpine

# Copy only necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
```

### Size Optimization Techniques

1. **Alpine base image**: ~5MB vs ~900MB for standard node
2. **Multi-stage build**: Separates build and runtime
3. **Prune dev dependencies**: `npm prune --omit=dev`
4. **Remove source maps**: Excluded via .dockerignore
5. **No dev tools**: TypeScript, ESLint excluded from production

### .dockerignore

Excludes unnecessary files from build context:

```
node_modules
dist
logs
.git
*.md
test
*.spec.ts
.env.local
```

---

## Troubleshooting

### Build Fails: Out of Memory

**Symptoms**:

```
ERROR [app 7/10] RUN npm install
EOF
```

**Solution**:

1. Increase Docker memory to 6-8GB
2. Docker Desktop → Settings → Resources → Memory
3. Restart Docker Desktop
4. Try: `npm run docker:prune && npm run docker:build`

---

### Image Size > 500MB

**Check which image**:

```bash
npm run docker:size
```

**If production image is too large**:

```bash
# Analyze what's taking space
npm run docker:analyze

# Rebuild from scratch
npm run docker:prune
npm run docker:build
```

---

### Container Won't Start

**Check logs**:

```bash
docker-compose logs app
docker-compose logs postgres
```

**Common issues**:

1. **Database not ready**: Wait for `database system is ready`
2. **Port conflict**: Change `PORT` in .env
3. **Volume permission**: Run `docker-compose down -v`

---

### Database Connection Error

**Verify PostgreSQL is healthy**:

```bash
docker-compose ps
# Look for "healthy" status

docker-compose exec postgres pg_isready
```

**Fix**:

```bash
# Restart PostgreSQL
docker-compose restart postgres

# Or reset completely
npm run docker:clean
npm run docker:dev
```

---

### Hot Reload Not Working (Dev Mode)

**Verify volume mounts**:

```bash
docker-compose exec app ls -la /app/src
```

**Fix**:

```bash
# Restart dev environment
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build
```

---

### Prisma Client Errors

**Regenerate Prisma Client**:

```bash
docker-compose exec app npx prisma generate
```

**Reapply migrations**:

```bash
docker-compose exec app npx prisma migrate deploy
```

---

### Cannot Connect to PostgreSQL from Local App

When running app locally but PostgreSQL in Docker:

```bash
# Ensure PostgreSQL is running
npm run docker:postgres

# Update .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library"
#                                           ^^^^^^^^^
#                                           Use localhost
```

---

## Docker Desktop Settings

### Recommended Configuration

**macOS/Windows**:

- **Memory**: 6GB (minimum 4GB)
- **Swap**: 2GB
- **Disk**: 60GB
- **CPUs**: 2-4

**Linux**:
Docker uses host resources directly, no configuration needed.

---

## Production Deployment

### 1. Build Production Image

```bash
npm run docker:build
```

### 2. Tag Image

```bash
docker tag home-library-app:latest your-registry/home-library-app:v1.0.0
```

### 3. Push to Registry

```bash
# Docker Hub
npm run docker:push

# Or custom registry
docker push your-registry/home-library-app:v1.0.0
```

### 4. Deploy

```yaml
# docker-compose.prod.yml on server
services:
  app:
    image: your-registry/home-library-app:v1.0.0
    environment:
      NODE_ENV: production
      # ... other env vars
```

---

## Security Best Practices

1. **Non-root user**: Container runs as user `nodejs` (UID 1001)
2. **No secrets in image**: Use environment variables
3. **Minimal base**: Alpine Linux
4. **Scan for vulnerabilities**: `npm run docker:scan`
5. **Update base image**: Regularly update Node.js version
6. **Use .dockerignore**: Prevent secret leaks
7. **Health checks**: Enable for monitoring

---

## Monitoring

### View Resource Usage

```bash
# All containers
docker stats

# Specific container
docker stats home-library-app
```

### Check Logs

```bash
# Stream logs
docker-compose logs -f app

# Save logs to file
docker-compose logs app > app.log
```

### Access Database

```bash
# PostgreSQL shell
docker-compose exec postgres psql -U postgres -d home_library

# Prisma Studio
docker-compose exec app npx prisma studio
# Access at http://localhost:5555
```

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
