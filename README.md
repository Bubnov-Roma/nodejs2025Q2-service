# Home Library Service

A RESTful API service for managing a home music library with JWT authentication, PostgreSQL database, and Prisma ORM.

## 🚀 Features

- **User Management**: JWT-based authentication with password hashing
- **Artists**: Manage artist information with Grammy awards tracking
- **Albums**: Track album details with artist associations
- **Tracks**: Individual track management with relationships
- **Favorites**: Personal favorites system
- **Database**: PostgreSQL with Prisma ORM
- **Docker**: Fully containerized with Docker Compose
- **Auto-migrations**: Database migrations applied automatically
- **Type Safety**: Full TypeScript + Prisma type generation
- **Optimized Images**: Production image < 500MB

## 📋 Prerequisites

- **Docker Desktop** (>= 20.x) with at least **4GB RAM** (6GB recommended) - [Download](https://docs.docker.com/get-docker/)
- **Docker Compose** (>= 2.x)
- **Node.js** (>= 22.14.0) - Only for local development
- **npm** - Included with Node.js

### Docker Desktop Configuration

Before starting, configure Docker Desktop for optimal performance:

**macOS/Windows:**

1. Open Docker Desktop → Settings → Resources
2. Memory: **6GB** (minimum 4GB)
3. Swap: **2GB**
4. Disk: **60GB**
5. Click "Apply & Restart"

## ⚡ Quick Start with Docker (Recommended)

### 1. Clone the repository

```bash
git clone git@github.com:Bubnov-Roma/nodejs2025Q2-service.git
cd nodejs2025Q2-service
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your Docker Hub username:

```env
DOCKER_USERNAME=yourusername
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/home_library?schema=public"
```

### 3. Run with Docker Compose

**Development mode (with hot reload):**

```bash
npm run docker:dev
```

- Image tag: `:dev`
- Size: ~700MB (includes TypeScript, ESLint, tests - **this is normal!**)
- Hot reload enabled
- Source code mounted as volume

**Production mode:**

```bash
npm run docker:prod
```

- Image tag: `:prod`
- Size: ~400MB (only runtime dependencies)
- Optimized for deployment
- No dev tools included

The application will be available at `http://localhost:4000`

### 4. Stop the application

```bash
npm run docker:down
```

## 🐳 Docker Images

This project creates **two separate Docker images**:

| Image           | Tag     | Size   | Usage             | Contents                                |
| --------------- | ------- | ------ | ----------------- | --------------------------------------- |
| **Development** | `:dev`  | ~700MB | Local development | TypeScript, ESLint, Jest, all dev tools |
| **Production**  | `:prod` | ~400MB | Deployment        | Only runtime dependencies, compiled JS  |

**Note**: Development image is intentionally larger - it needs all development tools!

## 🛠️ Local Development (Without Docker)

### 1. Install PostgreSQL locally

Ensure PostgreSQL is running on your machine.

### 2. Install dependencies

```bash
npm install
```

### 3. Setup database

```bash
createdb home_library
```

### 4. Update `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library?schema=public"
```

### 5. Run migrations

```bash
npx prisma migrate dev
```

### 6. Start the application

```bash
npm run start:dev
```

## 🗄️ Database & Prisma

### Automatic Migrations

Migrations are automatically applied when the Docker container starts. For local development:

```bash
# Create and apply migration
npx prisma migrate dev --name migration_name

# Apply existing migrations
npx prisma migrate deploy

# View database
npx prisma studio
```

### Database Schema

The database schema is defined in `prisma/schema.prisma`:

- **Users**: Authentication and user management
- **Artists**: Music artists with Grammy status
- **Albums**: Albums with artist relationships
- **Tracks**: Individual tracks with album/artist links
- **Favorites**: User favorites system

## 📜 Available Scripts

### Docker Commands

```bash
# Build production image (with safety checks)
npm run docker:build

# Build quickly (uses cache)
npm run docker:build:fast

# Start in development mode (hot reload)
npm run docker:dev

# Start in production mode
npm run docker:prod

# Start in background (detached)
npm run docker:prod:detached

# Stop all services
npm run docker:down

# Check image sizes (dev vs prod)
npm run docker:size

# Analyze image contents (what's using space)
npm run docker:analyze

# Scan for vulnerabilities
npm run docker:scan

# Push to Docker Hub
npm run docker:push

# Start only PostgreSQL
npm run docker:postgres

# Stop PostgreSQL
npm run docker:postgres:down

# Clean everything (removes volumes)
npm run docker:clean

# Remove all Docker artifacts
npm run docker:prune
```

### Application Commands

```bash
# Development with hot reload
npm run start:dev

# Production build
npm run build
npm run start:prod

# Standard start
npm run start
```

### Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and apply migration (dev)
npm run prisma:migrate:dev

# Apply migrations (production)
npm run prisma:migrate

# View database in browser
npm run prisma:studio

# Reset database
npm run prisma:reset
```

### Testing

```bash
# All tests (comment TODO lines first)
npm run test

# Tests with authorization
npm run test:auth

# Refresh token tests
npm run test:refresh
```

### Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format
```

## 🐳 Docker Configuration

### Multi-stage Build (Production)

The production `Dockerfile` uses a three-stage build to minimize image size:

1. **Builder stage**: Installs all dependencies and builds the application
2. **Deps stage**: Installs only production dependencies (clean install)
3. **Production stage**: Minimal final image with optimized node_modules

**Production image size**: ~400MB (< 500MB ✅)

### Development Build

The development `Dockerfile.dev` is simpler:

- Single stage with all dependencies
- Source code mounted as volume for hot reload
- Includes all dev tools (TypeScript, ESLint, Jest)

**Development image size**: ~700MB (includes all dev tools - **this is expected!**)

### Networks

Custom bridge network for service communication:

- **Production**: `home-library-network`
- **Development**: `home-library-network-dev`

### Volumes

Persistent data storage:

- `postgres_data`: PostgreSQL database files
- `postgres_logs`: PostgreSQL logs
- `app_logs`: Application logs

In development mode, source code is also mounted:

- `./src` → `/app/src` (for hot reload)

### Health Checks

Both containers have health checks:

- **PostgreSQL**: `pg_isready` check every 10s
- **Application**: HTTP check on port 4000

### Auto-restart

All containers configured with `restart: always` policy.

## 📖 API Documentation

### Authentication (Public)

- `POST /auth/signup` - Create new user
- `POST /auth/login` - Login and get tokens
- `POST /auth/refresh` - Refresh access token

### Protected Endpoints (Require JWT)

All endpoints below require `Authorization: Bearer <token>` header:

**Users:**

- `GET /user` - Get all users
- `GET /user/:id` - Get user by ID
- `POST /user` - Create user
- `PUT /user/:id` - Update password
- `DELETE /user/:id` - Delete user

**Artists:**

- `GET /artist` - Get all artists
- `GET /artist/:id` - Get artist by ID
- `POST /artist` - Create artist
- `PUT /artist/:id` - Update artist
- `DELETE /artist/:id` - Delete artist

**Albums:**

- `GET /album` - Get all albums
- `GET /album/:id` - Get album by ID
- `POST /album` - Create album
- `PUT /album/:id` - Update album
- `DELETE /album/:id` - Delete album

**Tracks:**

- `GET /track` - Get all tracks
- `GET /track/:id` - Get track by ID
- `POST /track` - Create track
- `PUT /track/:id` - Update track
- `DELETE /track/:id` - Delete track

**Favorites:**

- `GET /favs` - Get all favorites
- `POST /favs/artist/:id` - Add artist to favorites
- `DELETE /favs/artist/:id` - Remove artist from favorites
- `POST /favs/album/:id` - Add album to favorites
- `DELETE /favs/album/:id` - Remove album from favorites
- `POST /favs/track/:id` - Add track to favorites
- `DELETE /favs/track/:id` - Remove track from favorites

See [API_ENDPOINTS.md](./doc/API_ENDPOINTS.md) for detailed documentation.

## 🏗️ Project Structure

```
src/
├── prisma/                 # Prisma module
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── users/                  # User module
├── artists/                # Artist module
├── albums/                 # Album module
├── tracks/                 # Track module
├── favorites/              # Favorites module
├── auth/                   # Authentication module
└── main.ts                 # Entry point

prisma/
├── schema.prisma           # Database schema
└── migrations/             # Migration files

scripts/
├── docker-entrypoint.sh    # Container startup script
├── safe-build.sh           # Safe build with checks
├── check-image-size.sh     # Check image sizes
├── analyze-image.sh        # Analyze image contents
├── scan-vulnerabilities.sh # Security scanning
└── reset-database.sh       # Database reset
```

## 🔒 Security

- ✅ Passwords hashed using bcrypt
- ✅ JWT tokens for authentication
- ✅ Environment variables for secrets
- ✅ Docker security scanning available
- ✅ Non-root user in containers
- ✅ No dev dependencies in production
- ✅ Minimal production image surface

## 🐛 Troubleshooting

### => ERROR [app 7/10] RUN npm install --prefer-offline --no-audit --progress=false &&

![Image from Gyazo](https://i.gyazo.com/f02da4a130170b6a666aa259fe28d901.png)

**Cause:** Prisma CLI cannot download its binaries (engines). This is a network problem - either a local firewall/antivirus is blocking the connection, or there is a problem with your ISP or DNS

**Solution:**

1. Installation via VPN If the problem is at the provider level or regional blocking, VPN is a direct solution.

2. Use yarn instead of npm

```bash
npm install -g yarn
yarn add prisma @prisma/client
yarn prisma init
```

3. Change registry:

```bash
npm config set registry https://registry.npmmirror.com/
rm -rf node_modules package-lock.json
npm install prisma --save-dev
```

### Build fails with "EOF" or memory error

**Cause:** Docker runs out of memory during npm install

**Solution:**

1. Increase Docker memory to 6-8GB in Docker Desktop Settings
2. Close other applications
3. Clean up: `npm run docker:prune`
4. Try again: `npm run docker:build`

### Image size > 500MB

**Check which image:**

```bash
npm run docker:size
```

- **Development image (~700MB)**: This is normal! It includes all dev tools.
- **Production image (should be ~400MB)**: If it's > 500MB, run:

```bash
npm run docker:analyze
```

This will show what's taking up space. Then rebuild:

```bash
npm run docker:prune
npm run docker:build
```

### Database connection errors

```bash
# Reset database
npm run docker:clean
npm run docker:dev
```

### Port already in use

Change ports in `.env`:

```env
PORT=4001
POSTGRES_PORT=5433
```

### Prisma Client not generated

```bash
npx prisma generate
```

### Migration errors

```bash
# Reset and reapply migrations
npx prisma migrate reset
npx prisma migrate dev
```

### "Cannot connect to database"

**Check if PostgreSQL is ready:**

```bash
docker-compose logs postgres
```

Wait for: `database system is ready to accept connections`

**Restart services:**

```bash
npm run docker:down
npm run docker:prod
```

## 💡 Tips

### Development Workflow

```bash
# 1. Start development environment
npm run docker:dev

# 2. Make changes to src/ files
# (Changes are automatically reloaded)

# 3. When done
npm run docker:down
```

### Production Deployment

```bash
# 1. Build optimized image
npm run docker:build

# 2. Check size (should be < 500MB)
npm run docker:size

# 3. Test locally
npm run docker:prod

# 4. Push to registry
npm run docker:push
```

### Image Size Optimization

The production image is optimized through:

- Multi-stage build (builder → deps → production)
- `npm ci --omit=dev` (clean production install)
- Removal of unnecessary files (_.md, _.ts, \*.map)
- No TypeScript, ESLint, or test tools
- Minimal base image (node:24-alpine)

### Debugging

```bash
# View logs
docker-compose logs -f

# Only app logs
docker-compose logs -f app

# Execute command in container
docker-compose exec app sh

# Check what's inside the image
npm run docker:analyze
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open Pull Request

## 📝 License

UNLICENSED

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Database: [PostgreSQL](https://www.postgresql.org/)
- ORM: [Prisma](https://www.prisma.io/)
- Containerization: [Docker](https://www.docker.com/)
- Alma-Mater: [RS School](https://rs.school/courses/nodejs)
