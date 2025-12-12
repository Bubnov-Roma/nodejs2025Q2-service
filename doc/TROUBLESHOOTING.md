# Troubleshooting Guide

Solutions to common issues when running Home Library Service.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Docker Issues](#docker-issues)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [API Issues](#api-issues)
- [Testing Issues](#testing-issues)

---

## Installation Issues

### npm install fails

**Problem**: Dependencies installation fails

**Solutions**:

1. **Check Node.js version**:

```bash
node --version  # Should be >= 22.14.0
```

2. **Clear npm cache**:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

3. **Use different registry** (if network issues):

```bash
npm config set registry https://registry.npmmirror.com/
npm install
```

4. **Use yarn instead**:

```bash
npm install -g yarn
yarn install
```

---

### Prisma installation fails

**Problem**: Cannot download Prisma engines

**Symptoms**:

```
Error: Could not find Prisma engines
```

**Solutions**:

1. **Use VPN** (if provider/regional blocking)

2. **Set Prisma registry**:

```bash
npm config set @prisma:registry https://registry.npmmirror.com/
```

3. **Manual installation**:

```bash
npx prisma generate --skip-engine-validation
```

4. **Check firewall/antivirus**: Temporarily disable and retry

---

## Docker Issues

### Docker build fails with "EOF"

**Problem**: Out of memory during build

**Symptoms**:

```
ERROR [app 7/10] RUN npm install
EOF
```

**Solutions**:

1. **Increase Docker memory**:
   - Open Docker Desktop → Settings → Resources
   - Set Memory to **6-8GB**
   - Click "Apply & Restart"

2. **Close other applications** to free memory

3. **Clean Docker cache**:

```bash
npm run docker:prune
```

4. **Try safe build**:

```bash
npm run docker:build  # Uses safe-build.sh script
```

---

### Port already in use

**Problem**: Port 4000 or 5432 is occupied

**Symptoms**:

```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solutions**:

1. **Find and kill process** (Linux/macOS):

```bash
# For port 4000
lsof -ti:4000 | xargs kill -9

# For port 5432
lsof -ti:5432 | xargs kill -9
```

2. **Windows**:

```cmd
# Find process
netstat -ano | findstr :4000

# Kill process (replace <PID>)
taskkill /PID <PID> /F
```

3. **Change port in .env**:

```env
PORT=4001
POSTGRES_PORT=5433
```

---

### Image size > 500MB

**Problem**: Production image exceeds size limit

**Check**:

```bash
npm run docker:size
```

**Solutions**:

1. **Verify you're checking production image**:
   - Development image (~700MB) is expected
   - Production image should be ~400MB

2. **Analyze image contents**:

```bash
npm run docker:analyze
```

3. **Rebuild from scratch**:

```bash
npm run docker:prune
npm run docker:build
```

4. **Check for dev dependencies**:

```bash
docker run --rm home-library-app:latest \
  sh -c 'ls /app/node_modules/@types && echo "Dev deps found!" || echo "Clean"'
```

---

### Container won't start

**Problem**: Container exits immediately

**Check logs**:

```bash
docker-compose logs app
docker-compose logs postgres
```

**Common causes and solutions**:

1. **Database not ready**:
   - Wait for `database system is ready to accept connections`
   - Container will restart automatically

2. **Environment variables missing**:

```bash
# Check .env file exists
ls -la .env

# Verify DATABASE_URL
cat .env | grep DATABASE_URL
```

3. **Permission issues**:

```bash
# Reset volumes
docker-compose down -v
docker-compose up
```

---

## Database Issues

### Cannot connect to database

**Problem**: `ECONNREFUSED` or connection timeout

**Solutions**:

1. **Check PostgreSQL is running**:

```bash
# Docker
docker-compose ps
# Look for "healthy" status

# Local
pg_isready -U postgres
```

2. **Verify DATABASE_URL**:

```bash
# For Docker
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/home_library"
#                                           ^^^^^^^^
#                                         Service name

# For local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library"
#                                            ^^^^^^^^^
#                                            localhost
```

3. **Reset database**:

```bash
npm run docker:clean
npm run docker:dev
```

---

### Migration errors

**Problem**: Prisma migrations fail

**Symptoms**:

```
Error: P3009: migrate found failed migrations
```

**Solutions**:

1. **Reset migrations** (⚠️ deletes all data):

```bash
npx prisma migrate reset
```

2. **Reapply migrations**:

```bash
npx prisma migrate deploy
```

3. **Generate Prisma Client**:

```bash
npx prisma generate
```

4. **Check migration status**:

```bash
npx prisma migrate status
```

---

### Prisma Client not found

**Problem**: `Cannot find module '@prisma/client'`

**Solutions**:

1. **Generate Prisma Client**:

```bash
npx prisma generate
```

2. **Reinstall dependencies**:

```bash
rm -rf node_modules
npm install
```

3. **Check Prisma is installed**:

```bash
npm ls @prisma/client
npm ls prisma
```

---

## Authentication Issues

### "Unauthorized" on protected routes

**Problem**: 401 Unauthorized error

**Solutions**:

1. **Check token is provided**:

```bash
# Correct format
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
#              ^^^^^^
#              Note the space after "Bearer"
```

2. **Verify token hasn't expired**:
   - Access tokens expire after 1 hour (default)
   - Use refresh token to get new access token

3. **Check token format**:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/user
```

4. **Verify JWT_SECRET_KEY** matches in .env

---

### "Invalid refresh token"

**Problem**: Cannot refresh access token

**Solutions**:

1. **Check refresh token expiration**:
   - Default: 24 hours
   - After expiration, must login again

2. **Verify JWT_SECRET_REFRESH_KEY**:
   - Must match the key used to generate token
   - Check .env file

3. **Login again**:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"user","password":"pass"}'
```

---

### "Incorrect login or password"

**Problem**: Cannot login

**Solutions**:

1. **Verify credentials**:
   - Check username and password
   - Passwords are case-sensitive

2. **Check user exists**:

```bash
# Login first, then:
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/user
```

3. **Reset password**:

```bash
# Update password if you have access
curl -X PUT http://localhost:4000/user/:id \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"oldPassword":"old","newPassword":"new"}'
```

---

## API Issues

### 404 Not Found

**Problem**: Endpoint returns 404

**Solutions**:

1. **Check base URL**:

```bash
# Correct
http://localhost:4000/user

# Incorrect (missing /api prefix if configured)
http://localhost:4000/api/user
```

2. **Verify endpoint path**:
   - See [API_ENDPOINTS.md](./API_ENDPOINTS.md)
   - Check for typos

3. **Ensure application is running**:

```bash
curl http://localhost:4000
# Should return: Hello World!
```

---

### 400 Bad Request

**Problem**: Validation error

**Solutions**:

1. **Check request body format**:

```json
// Correct
{
  "login": "username",
  "password": "password123"
}

// Incorrect (missing required field)
{
  "login": "username"
}
```

2. **Verify UUID format** for ID parameters:

```bash
# Correct
/user/550e8400-e29b-41d4-a716-446655440000

# Incorrect
/user/123
```

3. **Check data types**:

```json
{
  "name": "Album", // String ✓
  "year": 2022, // Number ✓
  "artistId": "uuid" // String (UUID) ✓
}
```

---

### 500 Internal Server Error

**Problem**: Server error

**Solutions**:

1. **Check application logs**:

```bash
# Docker
docker-compose logs app

# Local
# Check logs/ directory
cat logs/error.log
```

2. **Common causes**:
   - Database connection lost
   - Invalid environment variables
   - Unhandled exception

3. **Restart application**:

```bash
# Docker
docker-compose restart app

# Local
# Stop (Ctrl+C) and restart
npm run start:dev
```

---

## Testing Issues

### Tests fail to start

**Problem**: Cannot run tests

**Solutions**:

1. **Ensure application is NOT running**:

```bash
# Stop application first
docker-compose down
# Or Ctrl+C if running locally
```

2. **Check test mode**:

```bash
# Without auth
npm run test

# With auth
npm run test:auth
```

3. **Reset database**:

```bash
npx prisma migrate reset
```

---

### "Unauthorized" during auth tests

**Problem**: Auth tests fail unexpectedly

**Solutions**:

1. **Comment out auth guards** for basic tests:
   - Edit controllers: albums, artists, favorites, tracks, users
   - Comment out `@UseGuards(JwtAuthGuard)` lines
   - See [TESTING.md](./TESTING.md)

2. **Verify test mode**:

```bash
# Should use auth mode
npm run test:auth
# NOT
npm run test
```

---

### Tests timeout

**Problem**: Tests hang or timeout

**Solutions**:

1. **Increase timeout**:

```typescript
// In test file
jest.setTimeout(30000); // 30 seconds
```

2. **Check database connection**:

```bash
npx prisma migrate deploy
```

3. **Kill orphaned processes**:

```bash
# macOS/Linux
lsof -ti:4000 | xargs kill -9
```

---

## Performance Issues

### Slow API responses

**Problem**: Endpoints respond slowly

**Solutions**:

1. **Check database query performance**:

```typescript
// Enable query logging
// In prisma.service.ts
PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

2. **Optimize database**:

```bash
# Vacuum PostgreSQL
docker-compose exec postgres psql -U postgres -d home_library -c "VACUUM ANALYZE;"
```

3. **Check system resources**:

```bash
docker stats
```

---

### High memory usage

**Problem**: Container uses too much memory

**Solutions**:

1. **Check for memory leaks**:

```bash
docker stats home-library-app
```

2. **Restart container**:

```bash
docker-compose restart app
```

3. **Adjust Node.js memory limit**:

```yaml
# docker-compose.yml
services:
  app:
    environment:
      NODE_OPTIONS: '--max-old-space-size=512'
```

---

## Environment-Specific Issues

### Different behavior Docker vs Local

**Problem**: Works in Docker but not locally (or vice versa)

**Solutions**:

1. **Check DATABASE_URL**:
   - Docker: `@postgres:5432`
   - Local: `@localhost:5432`

2. **Verify environment files**:
   - `.env` for Docker
   - `.env.local` for local

3. **Check Node.js versions match**:

```bash
node --version  # Should match Dockerfile
```

---

## Getting More Help

If these solutions don't work:

1. **Check logs**:
   - Application: `logs/app.log`, `logs/error.log`
   - Docker: `docker-compose logs`

2. **Enable debug logging**:

```env
LOG_LEVEL=5  # Verbose mode
```

3. **Search existing issues**:
   - [GitHub Issues](https://github.com/Bubnov-Roma/nodejs2025Q2-service/issues)

4. **Create new issue** with:
   - Error message
   - Steps to reproduce
   - Environment info (OS, Node.js version, Docker version)
   - Relevant logs

---

## Useful Commands Summary

```bash
# Application
npm run start:dev           # Start in dev mode
npm run docker:dev          # Start with Docker

# Database
npm run docker:postgres     # PostgreSQL only
npx prisma studio          # Database GUI
npx prisma migrate reset   # Reset database

# Docker
npm run docker:down        # Stop services
npm run docker:clean       # Clean volumes
npm run docker:prune       # Clean system
docker-compose logs -f     # View logs

# Debugging
docker-compose ps          # Check status
docker stats              # Resource usage
curl http://localhost:4000 # Test endpoint
```
