# Project Structure

Complete architectural overview of the Home Library Service.

## Table of Contents

- [Directory Tree](#directory-tree)
- [Module Architecture](#module-architecture)
- [Data Flow](#data-flow)
- [Core Modules](#core-modules)
- [Feature Modules](#feature-modules)
- [Infrastructure Modules](#infrastructure-modules)
- [Database Schema](#database-schema)
- [Key Design Patterns](#key-design-patterns)

---

## Directory Tree

```
nodejs2025Q2-service/
│
├── .github/                       # GitHub configuration
│   └── workflows/                 # CI/CD pipelines
│
├── doc/                           # Documentation
│   ├── API_ENDPOINTS.md           # Complete API reference
│   ├── AUTHENTICATION.md          # Authentication & JWT guide
│   ├── DOCKER.md                  # Docker setup & commands
│   ├── LOGGING.md                 # Logging system details
│   ├── PROJECT_STRUCTURE.md       # This file
│   ├── SETUP_INSTRUCTIONS.md      # Installation guide
│   ├── TESTING.md                 # Testing guide
│   ├── TROUBLESHOOTING.md         # Common issues & solutions
│   ├── api.yaml                   # OpenAPI specification
│   ├── Home_Library.postman_collection.json
│   └── Home_Library_Service.postman_test_run.json
│
├── generated/                     # Prisma generated files
│   └── prisma/                    # Prisma Client (auto-generated)
│       ├── browser.ts
│       ├── client.ts
│       ├── enums.ts
│       └── ...
│
├── logs/                          # Application logs (gitignored)
│   ├── app.log                    # All logs (rotated)
│   ├── error.log                  # Error logs only
│   └── app-*.log                  # Rotated log files
│
├── prisma/                        # Database
│   ├── migrations/                # Migration history
│   │   ├── 20251207183727_init/
│   │   └── migration_lock.toml
│   └── schema.prisma              # Database schema definition
│
├── scripts/                       # Utility scripts
│   ├── analyze-image.sh           # Docker image analysis
│   ├── check-image-size.sh        # Check Docker image size
│   ├── docker-entrypoint.sh       # Container startup script
│   ├── reset-database.sh          # Database reset utility
│   ├── safe-build.sh              # Safe Docker build
│   └── scan-vulnerabilities.sh    # Security scanning
│
├── src/                           # Source code
│   │
│   ├── common/                    # 🔧 Shared infrastructure modules
│   │   ├── filters/               # Exception filters
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/          # HTTP interceptors
│   │   │   └── logging.interceptor.ts
│   │   └── logging/               # Logging service
│   │       ├── logging.service.ts
│   │       └── logging.module.ts
│   │
│   ├── auth/                      # 🔐 Authentication module
│   │   ├── dto/
│   │   │   └── auth.dto.ts        # Authentication DTOs
│   │   ├── auth.controller.ts     # /auth routes (public)
│   │   ├── auth.service.ts        # Auth logic & JWT
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts        # Passport JWT strategy
│   │   └── jwt-auth.guard.ts      # JWT authentication guard
│   │
│   ├── users/                     # 👤 User management module
│   │   ├── dto/
│   │   │   └── create-user.dto.ts
│   │   ├── users.controller.ts    # /user routes (protected)
│   │   ├── users.service.ts       # User CRUD & password hashing
│   │   └── users.module.ts
│   │
│   ├── artists/                   # 🎤 Artist management module
│   │   ├── dto/
│   │   │   └── create-artist.dto.ts
│   │   ├── artists.controller.ts  # /artist routes (protected)
│   │   ├── artists.service.ts     # Artist CRUD
│   │   └── artists.module.ts
│   │
│   ├── albums/                    # 💿 Album management module
│   │   ├── dto/
│   │   │   └── create-album.dto.ts
│   │   ├── albums.controller.ts   # /album routes (protected)
│   │   ├── albums.service.ts      # Album CRUD
│   │   └── album.module.ts
│   │
│   ├── tracks/                    # 🎵 Track management module
│   │   ├── dto/
│   │   │   └── create-track.dto.ts
│   │   ├── tracks.controller.ts   # /track routes (protected)
│   │   ├── tracks.service.ts      # Track CRUD
│   │   └── tracks.module.ts
│   │
│   ├── favorites/                 # ⭐ Favorites management module
│   │   ├── favorites.controller.ts # /favs routes (protected)
│   │   ├── favorites.service.ts   # Favorites logic
│   │   └── favorites.module.ts
│   │
│   ├── prisma/                    # 🗄️ Prisma ORM module
│   │   ├── prisma.service.ts      # Database client
│   │   └── prisma.module.ts       # Global database module
│   │
│   ├── app.controller.ts          # Root controller
│   ├── app.service.ts             # Root service
│   ├── app.module.ts              # Root module (imports all)
│   └── main.ts                    # 🚀 Application entry point
│
├── test/                          # E2E tests
│   ├── auth/                      # Authorization tests
│   │   ├── albums.e2e.spec.ts
│   │   ├── artists.e2e.spec.ts
│   │   ├── favorites.e2e.spec.ts
│   │   ├── tracks.e2e.spec.ts
│   │   └── users.e2e.spec.ts
│   ├── refresh/                   # Refresh token tests
│   │   └── refresh.e2e.spec.ts
│   ├── lib/                       # Test utilities
│   │   ├── index.ts
│   │   └── request.ts
│   ├── utils/                     # Test helpers
│   │   ├── getTokenAndUserId.ts
│   │   ├── removeTokenUser.ts
│   │   ├── shouldAuthorizationBeTested.ts
│   │   ├── tokens.ts
│   │   └── index.ts
│   ├── albums.e2e.spec.ts         # Album tests (basic)
│   ├── artists.e2e.spec.ts        # Artist tests (basic)
│   ├── endpoints.ts               # Test route definitions
│   ├── favorites.e2e.spec.ts      # Favorites tests (basic)
│   ├── tracks.e2e.spec.ts         # Track tests (basic)
│   └── users.e2e.spec.ts          # User tests (basic)
│
├── .dockerignore                  # Docker ignore rules
├── .env                           # Environment (Docker)
├── .env.example                   # Environment template
├── .env.local                     # Environment (local)
├── .eslintrc.js                   # ESLint configuration
├── .gitignore                     # Git ignore rules
├── .prettierrc                    # Prettier configuration
├── docker-compose.yml             # Docker Compose (production)
├── docker-compose.dev.yml         # Docker Compose (development)
├── docker-compose.postgres.yml    # PostgreSQL only
├── Dockerfile                     # Docker image (production)
├── Dockerfile.dev                 # Docker image (development)
├── jest.config.json               # Jest configuration
├── nest-cli.json                  # NestJS CLI config
├── package.json                   # Dependencies & scripts
├── README.md                      # Main documentation
├── tsconfig.build.json            # TypeScript build config
└── tsconfig.json                  # TypeScript config
```

---

## Module Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AppModule                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Global Modules                           │  │
│  │  • ConfigModule (environment variables)               │  │
│  │  • LoggingModule (custom logging service)             │  │
│  │  • PrismaModule (database client)                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Security Layer                           │  │
│  │                                                       │  │
│  │   ┌──────────────────────────────────────┐            │  │
│  │   │         AuthModule                   │            │  │
│  │   │  • JWT Token Generation              │            │  │
│  │   │  • Refresh Token Logic               │            │  │
│  │   │  • Password Hashing (bcrypt)         │            │  │
│  │   │  • Passport JWT Strategy             │            │  │
│  │   │  • JwtAuthGuard (route protection)   │            │  │
│  │   └──────────────────────────────────────┘            │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Feature Modules                          │  │
│  │                                                       │  │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐            │  │
│  │   │  Users   │  │ Artists  │  │  Albums  │            │  │
│  │   │  Module  │  │  Module  │  │  Module  │            │  │
│  │   │          │  │          │  │          │            │  │
│  │   │ • CRUD   │  │ • CRUD   │  │ • CRUD   │            │  │
│  │   │ • Auth   │  │ • Grammy │  │ • Artist │            │  │
│  │   │ • Hash   │  │          │  │  Link    │            │  │
│  │   │ • Ver.   │  │          │  │          │            │  │
│  │   └──────────┘  └──────────┘  └──────────┘            │  │
│  │                                                       │  │
│  │   ┌──────────┐  ┌────────────┐                        │  │
│  │   │  Tracks  │  │ Favorites  │                        │  │
│  │   │  Module  │  │   Module   │                        │  │
│  │   │          │  │            │                        │  │
│  │   │ • CRUD   │  │ • Artists  │                        │  │
│  │   │ • Links  │  │ • Albums   │                        │  │
│  │   │          │  │ • Tracks   │                        │  │
│  │   └──────────┘  └────────────┘                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │             Middleware & Filters                      │  │
│  │  • LoggingInterceptor (HTTP request/response logging) │  │
│  │  • AllExceptionsFilter (centralized error handling)   │  │
│  │  • JwtAuthGuard (JWT verification)                    │  │
│  │  • ValidationPipe (DTO validation)                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Request Processing Pipeline

```
┌─────────┐
│ Client  │
└────┬────┘
     │ HTTP Request (JSON)
     ▼
┌────────────────────────────┐
│  LoggingInterceptor        │ ─► 📝 Log: URL, method, query, body
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│  JwtAuthGuard              │ ─► 🔐 Verify JWT token (if protected)
└────────────┬───────────────┘      ├─ Decode token
             │                      ├─ Validate signature
             │                      └─ Extract user payload
             ▼
┌────────────────────────────┐
│  ValidationPipe            │ ─► ✅ Validate request DTO
└────────────┬───────────────┘      ├─ Check required fields
             │                      ├─ Validate data types
             │                      └─ Transform data
             ▼
┌────────────────────────────┐
│  Controller                │ ─► 🎯 Route to appropriate handler
└────────────┬───────────────┘      └─ Extract params, body, query
             │
             ▼
┌────────────────────────────┐
│  Service                   │ ─► 💼 Execute business logic
└────────────┬───────────────┘      ├─ Validate business rules
             │                      ├─ Transform data
             │                      └─ Coordinate operations
             ▼
┌────────────────────────────┐
│  PrismaService             │ ─► 🗄️ Database operations
└────────────┬───────────────┘      ├─ Execute queries
             │                      ├─ Handle transactions
             │                      └─ Return results
             ▼
┌────────────────────────────┐
│  PostgreSQL                │ ─► 💾 Data persistence
└────────────┬───────────────┘      └─ Store/retrieve data
             │
             ▼
┌────────────────────────────┐
│  Service                   │ ─► 🔄 Transform database results
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│  Controller                │ ─► 📤 Format HTTP response
└────────────┬───────────────┘      └─ Set status code
             │
             ▼
┌────────────────────────────┐
│  LoggingInterceptor        │ ─► 📝 Log: status, duration, response
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│  AllExceptionsFilter       │ ─► ⚠️ Handle errors (if any)
└────────────┬───────────────┘      ├─ Format error response
             │                      ├─ Set proper status code
             │                      └─ Log error details
             │ HTTP Response (JSON)
             ▼
┌─────────┐
│ Client  │
└─────────┘
```

### Authentication Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. POST /auth/signup
     ▼
┌────────────────┐
│ AuthController │
└────────┬───────┘
         │
         ▼
┌────────────────┐     ┌──────────────┐
│  AuthService   │────▶│ UsersService │
└────────┬───────┘     └──────┬───────┘
         │                    │
         │              2. Hash password (bcrypt)
         │                    │
         │              3. Create user in DB
         │◀───────────────────┘
         │
         │ 4. Return user (without password)
         ▼
┌─────────┐
│  User   │ ✅ User created
└────┬────┘
     │
     │ 5. POST /auth/login
     ▼
┌────────────────┐
│ AuthController │
└────────┬───────┘
         │
         ▼
┌────────────────┐     ┌──────────────┐
│  AuthService   │────▶│ UsersService │
└────────┬───────┘     └──────┬───────┘
         │                    │
         │              6. Find user by login
         │◀───────────────────┘
         │
         │ 7. Verify password (bcrypt.compare)
         │
         │ 8. Generate JWT tokens:
         │    ├─ accessToken (1h)
         │    └─ refreshToken (24h)
         │
         │ 9. Return tokens
         ▼
┌─────────┐
│  User   │ 🔐 Tokens received
└────┬────┘
     │
     │ 10. GET /user (with Bearer token)
     ▼
┌────────────────┐
│ JwtAuthGuard   │
└────────┬───────┘
         │
         │ 11. Extract & verify token
         │     ├─ Check signature
         │     ├─ Check expiration
         │     └─ Extract payload
         │
         │ 12. Attach user to request
         ▼
┌────────────────┐
│UserController  │ ✅ Access granted
└────────────────┘
```

---

## Core Modules

### Common Module (Infrastructure)

```
src/common/
├── filters/
│   └── http-exception.filter.ts    # Global exception handler
├── interceptors/
│   └── logging.interceptor.ts      # HTTP request/response logger
└── logging/
    ├── logging.service.ts          # Custom logging service
    └── logging.module.ts           # Logging module
```

**Purpose**: Provides shared infrastructure services

**Key Features**:

- **Exception Filtering**: Centralized error handling
- **HTTP Logging**: Automatic request/response logging
- **Custom Logger**: Multi-level logging with file rotation

**Usage Example**:

```typescript
// In any service
constructor(private logger: LoggingService) {}

someMethod() {
  this.logger.log('Operation started', 'ServiceName');
  this.logger.error('Error occurred', 'ServiceName');
}
```

### Auth Module (Security)

```
src/auth/
├── dto/
│   └── auth.dto.ts                 # SignupDto, LoginDto, RefreshDto
├── auth.controller.ts              # Public endpoints
├── auth.service.ts                 # JWT logic
├── auth.module.ts
├── jwt.strategy.ts                 # Passport strategy
└── jwt-auth.guard.ts               # Route protection
```

**Purpose**: Handles authentication and authorization

**Key Features**:

- **User Registration**: Password hashing with bcrypt
- **Login**: JWT token generation
- **Token Refresh**: Seamless token renewal
- **Route Protection**: JWT verification guard

**Endpoints**:

- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get tokens
- `POST /auth/refresh` - Refresh access token

**Token Structure**:

```typescript
// Access Token Payload
{
  userId: string;
  login: string;
  iat: number; // Issued at
  exp: number; // Expires in 1 hour
}

// Refresh Token Payload
{
  userId: string;
  login: string;
  iat: number; // Issued at
  exp: number; // Expires in 24 hours
}
```

**Security Implementation**:

```typescript
// Password Hashing
const hashedPassword = await bcrypt.hash(
  password,
  Number(process.env.CRYPT_SALT),
);

// Password Verification
const isValid = await bcrypt.compare(password, user.password);

// JWT Generation
const accessToken = this.jwtService.sign(payload, {
  secret: this.configService.get('JWT_SECRET_KEY'),
  expiresIn: '1h',
});
```

### Prisma Module (Database)

```
src/prisma/
├── prisma.service.ts               # Database client
└── prisma.module.ts                # Global module
```

**Purpose**: Database access layer

**Key Features**:

- **Type-Safe Queries**: Auto-generated types
- **Connection Management**: Automatic connect/disconnect
- **Transaction Support**: Built-in transaction handling
- **Query Logging**: Development query logging

**Usage Example**:

```typescript
constructor(private prisma: PrismaService) {}

async findAll() {
  return this.prisma.user.findMany();
}

async findOne(id: string) {
  return this.prisma.user.findUnique({
    where: { id }
  });
}
```

---

## Feature Modules

### Users Module

```
src/users/
├── dto/
│   └── create-user.dto.ts          # CreateUserDto, UpdatePasswordDto
├── users.controller.ts             # CRUD endpoints (protected)
├── users.service.ts                # Business logic
└── users.module.ts
```

**Responsibilities**:

- User CRUD operations
- Password management & hashing
- Version tracking
- Password validation

**Endpoints** (all protected):

- `GET /user` - Get all users
- `GET /user/:id` - Get user by ID
- `POST /user` - Create user
- `PUT /user/:id` - Update password
- `DELETE /user/:id` - Delete user

**Business Rules**:

- Passwords are hashed with bcrypt
- Version increments on password change
- Password excluded from responses
- Old password must be correct for update

### Artists Module

```
src/artists/
├── dto/
│   └── create-artist.dto.ts        # CreateArtistDto, UpdateArtistDto
├── artists.controller.ts           # CRUD endpoints (protected)
├── artists.service.ts              # Business logic
└── artists.module.ts
```

**Responsibilities**:

- Artist CRUD operations
- Grammy award tracking
- Cascade operations on delete

**Cascade Rules**:

- Delete artist → Remove from favorites
- Delete artist → Set artistId=null in albums
- Delete artist → Set artistId=null in tracks

### Albums Module

```
src/albums/
├── dto/
│   └── create-album.dto.ts         # CreateAlbumDto, UpdateAlbumDto
├── albums.controller.ts            # CRUD endpoints (protected)
├── albums.service.ts               # Business logic
└── album.module.ts
```

**Responsibilities**:

- Album CRUD operations
- Artist relationship management
- Cascade operations on delete

**Cascade Rules**:

- Delete album → Remove from favorites
- Delete album → Set albumId=null in tracks

### Tracks Module

```
src/tracks/
├── dto/
│   └── create-track.dto.ts         # CreateTrackDto, UpdateTrackDto
├── tracks.controller.ts            # CRUD endpoints (protected)
├── tracks.service.ts               # Business logic
└── tracks.module.ts
```

**Responsibilities**:

- Track CRUD operations
- Artist & album relationship management
- Duration tracking (in seconds)
- Cascade operations on delete

**Cascade Rules**:

- Delete track → Remove from favorites

### Favorites Module

```
src/favorites/
├── favorites.controller.ts         # Favorites endpoints (protected)
├── favorites.service.ts            # Favorites logic
└── favorites.module.ts
```

**Responsibilities**:

- Manage user favorites
- Add/remove artists, albums, tracks
- Aggregate favorites view

**Endpoints** (all protected):

- `GET /favs` - Get all favorites
- `POST /favs/artist/:id` - Add artist
- `DELETE /favs/artist/:id` - Remove artist
- `POST /favs/album/:id` - Add album
- `DELETE /favs/album/:id` - Remove album
- `POST /favs/track/:id` - Add track
- `DELETE /favs/track/:id` - Remove track

---

## Infrastructure Modules

### Logging System

**Architecture**:

```
LoggingInterceptor → LoggingService → File System
                                    ├─ app.log (all logs)
                                    └─ error.log (errors only)
```

**Log Levels**:

- `error` (0): Critical errors
- `warn` (1): Warnings
- `log` (2): General information
- `debug` (3): Debug information
- `verbose` (4): Detailed information

**Log Format**:

```
[Timestamp] [Level] [Context] Message
[2025-12-12 10:30:45] [LOG] [UserService] User created: abc-123
[2025-12-12 10:30:46] [ERROR] [UserService] Failed to create user: Validation error
```

**Features**:

- Automatic log rotation (5MB max)
- Separate error log file
- HTTP request/response logging
- Configurable log level
- Process error handling

### Exception Handling

**Global Exception Filter**:

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Format error response
    // Log error details
    // Return proper HTTP status
  }
}
```

**Error Response Format**:

```json
{
  "statusCode": 400,
  "timestamp": "2025-12-12T10:30:45.000Z",
  "path": "/user/invalid-id",
  "message": "Validation failed"
}
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ login       │◀──── Unique
│ password    │
│ version     │
│ createdAt   │
│ updatedAt   │
└─────────────┘

┌─────────────┐         ┌─────────────┐
│   Artist    │         │    Album    │
├─────────────┤         ├─────────────┤
│ id (PK)     │────┐    │ id (PK)     │
│ name        │    │    │ name        │
│ grammy      │    │    │ year        │
└─────────────┘    │    │ artistId(FK)│◀──┐
                   │    └─────────────┘   │
                   │                      │
                   │    ┌─────────────┐   │
                   │    │    Track    │   │
                   │    ├─────────────┤   │
                   └───▶│ id (PK)     │   │
                        │ name        │   │
                        │ artistId(FK)│◀──┤
                        │ albumId (FK)│◀──┘
                        │ duration    │
                        └─────────────┘

┌──────────────┐
│  Favorite    │
├──────────────┤
│ id (PK)      │
│ entityId     │◀──── Can reference Artist, Album, or Track
│ entityType   │◀──── 'artist' | 'album' | 'track'
└──────────────┘
     │
     │ Unique(entityId, entityType)
```

### Cascade Operations

```
DELETE Artist
    │
    ├─▶ favorites.artistId = deleted
    ├─▶ albums.artistId = null
    └─▶ tracks.artistId = null

DELETE Album
    │
    ├─▶ favorites.albumId = deleted
    └─▶ tracks.albumId = null

DELETE Track
    │
    └─▶ favorites.trackId = deleted
```

---

## Key Design Patterns

### Dependency Injection

```typescript
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggingService,
  ) {}
}
```

### Repository Pattern

```typescript
// Service acts as repository
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
```

### Guard Pattern

```typescript
@Controller('user')
@UseGuards(JwtAuthGuard) // Applied to all routes
export class UsersController {
  // All endpoints protected
}
```

### DTO Pattern

```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

### Module Encapsulation

```typescript
@Module({
  imports: [PrismaModule], // Dependencies
  controllers: [UsersController], // Controllers
  providers: [UsersService], // Services
  exports: [UsersService], // Exposed services
})
export class UsersModule {}
```

---

## Testing Architecture

```
test/
├── Basic Tests (no auth)
│   ├── users.e2e.spec.ts
│   ├── artists.e2e.spec.ts
│   ├── albums.e2e.spec.ts
│   ├── tracks.e2e.spec.ts
│   └── favorites.e2e.spec.ts
│
├── Authorization Tests
│   └── auth/
│       ├── users.e2e.spec.ts
│       ├── artists.e2e.spec.ts
│       ├── albums.e2e.spec.ts
│       ├── tracks.e2e.spec.ts
│       └── favorites.e2e.spec.ts
│
└── Token Tests
    └── refresh/
        └── refresh.e2e.spec.ts
```

---

## Additional Resources

- [API Endpoints](API_ENDPOINTS.md) - Complete API reference
- [Authentication Guide](AUTHENTICATION.md) - JWT & security details
- [Testing Guide](TESTING.md) - How to run tests
- [Setup Instructions](SETUP_INSTRUCTIONS.md) - Installation guide
- [Docker Guide](DOCKER.md) - Docker configuration
