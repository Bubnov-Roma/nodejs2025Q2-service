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

## 📋 Prerequisites

- **Docker** (>= 20.x) - [Download](https://docs.docker.com/get-docker/)
- **Docker Compose** (>= 2.x)
- **Node.js** (>= 22.14.0) - Only for local development
- **npm** - Included with Node.js

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

**Production mode:**

```bash
npm run docker:prod
```

The application will be available at `http://localhost:4000`

### 4. Stop the application

```bash
npm run docker:down
```

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
# Build images
npm run docker:build

# Start in development mode (hot reload)
npm run docker:dev

# Start in production mode
npm run docker:prod

# Stop all services
npm run docker:down

# Scan for vulnerabilities
npm run docker:scan

# Push to Docker Hub
npm run docker:push

# Clean and reset database
npm run docker:clean
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

### Multi-stage Build

The Dockerfile uses multi-stage builds to optimize image size:

1. **Builder stage**: Installs dependencies and builds the application
2. **Production stage**: Minimal image with only production dependencies

**Final image size**: < 500 MB ✅

### Networks

Custom bridge network for service communication:

- **Production**: `home-library-network`
- **Development**: `home-library-network-dev`

### Volumes

Persistent data storage:

- `postgres_data`: PostgreSQL database files
- `postgres_logs`: PostgreSQL logs
- `app_logs`: Application logs

### Health Checks

Both containers have health checks:

- **PostgreSQL**: Checks database readiness
- **Application**: HTTP health check on port 4000

### Auto-restart

All containers configured with `restart: always` policy.

## 📖 API Documentation

### Authentication (Public)

- `POST /auth/signup` - Create new user
- `POST /auth/login` - Login and get tokens
- `POST /auth/refresh` - Refresh access token

### Protected Endpoints (Require JWT)

All endpoints below require `Authorization: Bearer <token>` header:

- `GET /user` - Get all users
- `GET /user/:id` - Get user by ID
- `POST /user` - Create user
- `PUT /user/:id` - Update password
- `DELETE /user/:id` - Delete user

- `GET /artist` - Get all artists
- `GET /artist/:id` - Get artist by ID
- `POST /artist` - Create artist
- `PUT /artist/:id` - Update artist
- `DELETE /artist/:id` - Delete artist

- `GET /album` - Get all albums
- `GET /album/:id` - Get album by ID
- `POST /album` - Create album
- `PUT /album/:id` - Update album
- `DELETE /album/:id` - Delete album

- `GET /track` - Get all tracks
- `GET /track/:id` - Get track by ID
- `POST /track` - Create track
- `PUT /track/:id` - Update track
- `DELETE /track/:id` - Delete track

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
```

## 🔒 Security

- Passwords hashed using bcrypt
- JWT tokens for authentication
- Environment variables for secrets
- Docker security scanning available
- Non-root user in containers

## 🐛 Troubleshooting

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

## 📊 Task Score Checklist

### Containerization, Docker (150 points)

- ✅ [20] README with instructions
- ✅ [30] User-defined bridge network
- ✅ [30] Auto-restart after crash
- ✅ [20] Hot reload in development
- ✅ [30] Data stored in volumes
- ✅ [20] Image size < 500 MB
- ✅ [10] Vulnerability scanning script
- ✅ [20] Image pushed to Docker Hub

### Database & ORM (130 points)

- ✅ [20] Users in PostgreSQL + Prisma
- ✅ [20] Artists in PostgreSQL + Prisma
- ✅ [20] Albums in PostgreSQL + Prisma
- ✅ [20] Tracks in PostgreSQL + Prisma
- ✅ [20] Favorites in PostgreSQL + Prisma
- ✅ [30] Migrations used
- ✅ [10] Variables in .env
- ✅ [10] Prisma relations
- ✅ [30] PostgreSQL in Docker

**Total: 280 points** 🎯

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
