# Home Library Service

A RESTful API service for managing a home music library with **JWT authentication**, **comprehensive logging & error handling**, PostgreSQL database, and Prisma ORM.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.14.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4-red)](https://nestjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

## 📚 Documentation

- **[Setup Instructions](doc/SETUP_INSTRUCTIONS.md)** - Installation and configuration
- **[API Endpoints](doc/API_ENDPOINTS.md)** - Complete API reference
- **[Authentication Guide](doc/AUTHENTICATION.md)** - JWT authentication & authorization
- **[Logging System](doc/LOGGING.md)** - Logging & error handling
- **[Testing Guide](doc/TESTING.md)** - How to run tests
- **[Project Structure](doc/PROJECT_STRUCTURE.md)** - Architecture overview
- **[Docker Guide](doc/DOCKER.md)** - Docker configuration & deployment
- **[Troubleshooting](doc/TROUBLESHOOTING.md)** - Common issues and solutions

## 🚀 Features

### Core Functionality

- **User Management**: Full CRUD operations with version tracking
- **Artists**: Manage artist information with Grammy awards tracking
- **Albums**: Track album details with artist associations
- **Tracks**: Individual track management with relationships
- **Favorites**: Personal favorites system for artists, albums, and tracks

### Security & Authentication

- **JWT Authentication**: Access and Refresh tokens
- **Password Hashing**: bcrypt encryption for all passwords
- **Protected Routes**: All endpoints except auth routes require valid JWT
- **Token Refresh**: Seamless token renewal mechanism

### Logging & Error Handling

- **Custom Logging Service**: Multi-level logging system (error, warn, log, debug, verbose)
- **HTTP Request/Response Logging**: Automatic logging of all HTTP traffic
- **Global Exception Filter**: Centralized error handling with proper status codes
- **Log Rotation**: Automatic rotation by file size
- **Separate Error Logs**: Dedicated error log file for easy debugging
- **Process Error Handling**: Handling of uncaughtException and unhandledRejection

### Infrastructure

- **Database**: PostgreSQL with Prisma ORM
- **Docker**: Fully containerized with Docker Compose
- **Auto-migrations**: Database migrations applied automatically
- **Type Safety**: Full TypeScript + Prisma type generation
- **Optimized Images**: Production image < 500MB

## ⚡ Quick Start

### Prerequisites

- **Docker Desktop** (>= 20.x) with at least **4GB RAM** (6GB recommended)
- **Docker Compose** (>= 2.x)
- **Node.js** (>= 22.14.0) - Only for local development

### Using Docker (Recommended)

```bash
# 1. Clone repository
git clone git@github.com:Bubnov-Roma/nodejs2025Q2-service.git
cd nodejs2025Q2-service

# 2. Configure environment
cp .env.example .env
# Edit .env and set DOCKER_USERNAME

# 3. Start in development mode
npm run docker:dev

# Application will be available at http://localhost:4000
```

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL
npm run docker:postgres

# 3. Configure .env.local for localhost
cp .env.example .env.local
# Edit DATABASE_URL to use localhost

# 4. Run migrations
npx prisma migrate dev

# 5. Start application
npm run start:dev
```

See **[Setup Instructions](doc/SETUP_INSTRUCTIONS.md)** for detailed guide.

## 📖 API Overview

### Authentication (Public)

- `POST /auth/signup` - Create new user
- `POST /auth/login` - Login and get tokens
- `POST /auth/refresh` - Refresh access token

### Protected Endpoints

All require `Authorization: Bearer <token>` header:

- **Users**: `/user` - CRUD operations
- **Artists**: `/artist` - CRUD operations
- **Albums**: `/album` - CRUD operations
- **Tracks**: `/track` - CRUD operations
- **Favorites**: `/favs` - Manage favorites

See **[API Endpoints](doc/API_ENDPOINTS.md)** for complete reference.

## 🧪 Testing

```bash
# All tests without authentication
npm run test

# Authentication tests
npm run test:auth

# Refresh token tests
npm run test:refresh
```

See **[Testing Guide](doc/TESTING.md)** for details.

## 📊 Project Architecture

```
nodejs2025Q2-service/
├── src/
│   ├── common/              # Shared modules
│   │   ├── filters/         # Exception filters
│   │   ├── interceptors/    # HTTP logging
│   │   └── logging/         # Logging service
│   ├── auth/                # Authentication
│   ├── users/               # User management
│   ├── artists/             # Artist management
│   ├── albums/              # Album management
│   ├── tracks/              # Track management
│   ├── favorites/           # Favorites system
│   ├── prisma/              # Prisma module
│   └── main.ts              # Entry point
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration files
├── doc/                     # Documentation
├── scripts/                 # Utility scripts
└── test/                    # E2E tests
```

See **[Project Structure](doc/PROJECT_STRUCTURE.md)** for detailed breakdown.

## 🔒 Security

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Environment variables for secrets
- ✅ Protected routes with guards
- ✅ Input validation with class-validator
- ✅ Non-root user in Docker containers

## 📝 Environment Variables

Create `.env` (Docker) and `.env.local` (local development):

```env
# Application
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library"

# JWT
JWT_SECRET_KEY=your_secret_key
JWT_SECRET_REFRESH_KEY=your_refresh_secret
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

# Logging
LOG_LEVEL=3                    # 0-5 (default: 3)
MAX_LOG_FILE_SIZE=5120         # KB (default: 5MB)
CLEAR_LOGS_ON_STARTUP=true     # Clear logs on restart
```

## 🐳 Docker

```bash
# Development (hot reload)
npm run docker:dev

# Production
npm run docker:prod

# Check sizes
npm run docker:size

# Clean up
npm run docker:clean
```

See **[Docker Guide](doc/DOCKER.md)** for more commands.

## 🛠️ Available Scripts

### Application

- `npm run start:dev` - Development with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Run production build

### Testing

- `npm run test` - Run all tests
- `npm run test:auth` - Authentication tests
- `npm run test:refresh` - Refresh token tests
- `npm run lint` - Lint code
- `npm run format` - Format code

### Docker

- `npm run docker:dev` - Development mode
- `npm run docker:prod` - Production mode
- `npm run docker:down` - Stop containers
- `npm run docker:clean` - Clean everything

### Database

- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:migrate:dev` - Create migration
- `npm run prisma:generate` - Generate Prisma Client

### Logs

- `npm run logs:clear` - Clear all log files

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open Pull Request

## 📄 License

UNLICENSED

## 🎓 Credits

- **Course**: [RS School Node.js Course](https://rs.school/courses/nodejs)
- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io/)
- **Containerization**: [Docker](https://www.docker.com/)

---

**Made with ❤️ within the [RS](https://rs.school/) School**
