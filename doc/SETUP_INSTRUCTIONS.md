# Home Library Service - Setup Instructions

- **Git** - [Download & Install Git](https://git-scm.com/downloads)
- **Node.js** (>= 22.14.0) - [Download & Install Node.js](https://nodejs.org/en/download/)
- **npm** - Included with Node.js

## Installation

### 1. Clone the repository

```bash
git clone git@github.com:Bubnov-Roma/nodejs2025Q2-service.git
cd nodejs2025Q2-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory (use `.env.example` as a template):

```env
NODE_ENV=development
PORT=4000

CRYPT_SALT=10
JWT_SECRET_KEY=secret123123
JWT_SECRET_REFRESH_KEY=secret123123
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

# PostgreSQL Configuration
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=home_library

# Prisma Database
# For LOCAL development (postgres on localhost)
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library?schema=public"

# For DOCKER (postgres in container)
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/home_library?schema=public"

# Docker Hub
DOCKER_USERNAME=your_username
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Standard Start

```bash
npm run start
```

After starting, the application will be available at `http://localhost:4000`
