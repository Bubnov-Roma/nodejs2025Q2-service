# Home Library Service

A RESTful API service for managing a home music library with support for users, artists, albums, tracks, and favorites.

## Features

- **User Management**: Create, read, update, and delete user accounts with password management
- **Artists**: Manage artist information including Grammy awards status
- **Albums**: Track album details with artist associations
- **Tracks**: Manage individual track information with artist and album relationships
- **Favorites**: Add and manage favorite artists, albums, and tracks
- **Authentication**: JWT-based authentication with access and refresh tokens
- **Database**: PostgreSQL with TypeORM
- **Docker**: Fully containerized application with Docker Compose
- **Cascade Deletion**: Automatic cleanup of references when entities are deleted
- **Validation**: Comprehensive input validation using class-validator

## Prerequisites

- **Docker** (>= 20.x) - [Download & Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (>= 2.x) - Usually included with Docker Desktop
- **Node.js** (>= 22.14.0) - Only required for local development without Docker
- **npm** - Included with Node.js

## Quick Start with Docker (Recommended)

### 1. Clone the repository

```bash
git clone git@github.com:Bubnov-Roma/nodejs2025Q2-service.git
cd nodejs2025Q2-service
```

### 2. Configure environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and set your Docker Hub username:

```env
PORT=4000

CRYPT_SALT=10
JWT_SECRET_KEY=your_secret_key_here
JWT_SECRET_REFRESH_KEY=your_refresh_secret_key_here
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

# Database
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=home_library

# Docker Hub username
DOCKER_USERNAME=yourusername
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

## Local Development (Without Docker)

If you prefer to run the application locally without Docker:

### 1. Install PostgreSQL locally

Make sure PostgreSQL is installed and running on your machine.

### 2. Create database

```bash
createdb home_library
```

### 3. Install dependencies

```bash
npm install
```

### 4. Update `.env` file

```env
POSTGRES_HOST=localhost
```

### 5. Run the application

```bash
npm run start:dev
```

## Database Setup

### Automatic Setup (with Docker)

The database is automatically created when you run:

```bash
npm run docker:dev
```

### Manual Setup (if needed)

If you need to manually set up the database:

```bash
# Make the script executable
chmod +x scripts/setup-database.sh

# Run the setup script
npm run db:setup
```

This script will:

- Check if Docker is running
- Start PostgreSQL container
- Create the database if it doesn't exist
- Show available databases

## TypeORM Synchronization

The application uses TypeORM's `synchronize: true` option in development, which automatically creates database tables based on your entities. This means:

- No manual migrations needed in development
- Tables are automatically created/updated when you change entities
- Perfect for rapid development

**Note**: In production, you should use migrations instead of synchronization.

## Available Scripts

### Docker Commands

```bash
# Build Docker images
npm run docker:build

# Start services in development mode
npm run docker:dev

# Start services in production mode
npm run docker:prod

# Stop all services
npm run docker:down

# Scan Docker images for vulnerabilities
npm run docker:scan

# Push images to Docker Hub
npm run docker:push
```

### Application Commands

```bash
# Development with hot reload
npm run start:dev

# Production build and run
npm run build
npm run start:prod

# Standard start
npm run start
```

### Database Commands

```bash
# Setup database
npm run db:setup
```

### Testing

```bash
# Run all tests (without authorization)
npm run test

# Run tests with authorization
npm run test:auth

# Run specific test suite
npm run test -- <path-to-suite>

# Run refresh token tests
npm run test:refresh
```

### Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format
```

## Docker Configuration

### Networks

The application uses a custom bridge network (`home-library-network`) for communication between containers:

- **Production**: `home-library-network`
- **Development**: `home-library-network-dev`

### Volumes

Persistent data is stored in Docker volumes:

- `postgres_data`: PostgreSQL database files
- `postgres_logs`: PostgreSQL logs
- `app_logs`: Application logs

### Health Checks

Both containers have health checks configured:

- **PostgreSQL**: Checks if database is ready to accept connections
- **Application**: HTTP health check on port 4000

### Auto-restart

All containers are configured with `restart: always` policy, ensuring they automatically restart after crashes or system reboots.

## API Documentation

See [API Endpoints](./doc/API_Endpoints.md) for detailed API documentation.

## Project Structure

See [Project Structure](./doc/PROJECT_STRUCTURE.md) for detailed project structure.

## Testing

See [Testing Guide](./doc/TESTING.md) for testing instructions.

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Environment variables for sensitive data
- Docker image vulnerability scanning available

## Troubleshooting

### Database connection errors

If you see "database does not exist" errors:

1. Make sure Docker is running
2. Run the database setup script:
   ```bash
   npm run db:setup
   ```
3. Restart the application

### Port already in use

If port 4000 or 5432 is already in use:

1. Stop conflicting services
2. Or change ports in `.env` file

### Docker volume issues

If you need to reset the database:

```bash
# Stop all services
npm run docker:down

# Remove volumes
docker volume rm home-library-postgres-data

# Start again
npm run docker:dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License.
