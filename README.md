# Home Library Service

A RESTful API service for managing a home music library with support for users, artists, albums, tracks, and favorites.

## Features

- **User Management**: Create, read, update, and delete user accounts with password management
- **Artists**: Manage artist information including Grammy awards status
- **Albums**: Track album details with artist associations
- **Tracks**: Manage individual track information with artist and album relationships
- **Favorites**: Add and manage favorite artists, albums, and tracks
- **Authentication**: JWT-based authentication with access and refresh tokens
- **Cascade Deletion**: Automatic cleanup of references when entities are deleted
- **Validation**: Comprehensive input validation using class-validator
- **In-Memory Storage**: Fast data access with in-memory storage (ready for database migration)

## Prerequisites

- **Git** - [Download & Install Git](https://git-scm.com/downloads)
- **Node.js** (>= 22.14.0) - [Download & Install Node.js](https://nodejs.org/en/download/)
- **npm** - Included with Node.js

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd nodejs2025Q2-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install additional required packages

```bash
npm install @nestjs/passport passport passport-jwt @types/passport-jwt
```

### 4. Configure environment variables

Create a `.env` file in the root directory (use `.env.example` as a template):

```env
PORT=4000

CRYPT_SALT=10
JWT_SECRET_KEY=secret123123
JWT_SECRET_REFRESH_KEY=secret123123
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h
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
npm start
```

After starting, the application will be available at `http://localhost:4000`

## API Documentation

OpenAPI documentation is available at `http://localhost:4000/doc/` (after starting the application)

## API Endpoints

### Authentication (Public)

#### Sign Up

- **POST** `/auth/signup`
- **Body**: `{ "login": "string", "password": "string" }`
- **Response**: `201 Created` - User object without password

#### Login

- **POST** `/auth/login`
- **Body**: `{ "login": "string", "password": "string" }`
- **Response**: `200 OK` - `{ "accessToken": "string", "refreshToken": "string" }`

#### Refresh Token

- **POST** `/auth/refresh`
- **Body**: `{ "refreshToken": "string" }`
- **Response**: `200 OK` - New token pair

### Users (Protected)

All user endpoints require Bearer authentication token.

#### Get All Users

- **GET** `/user`
- **Response**: `200 OK` - Array of users (passwords excluded)

#### Get User by ID

- **GET** `/user/:id`
- **Response**: `200 OK` - User object | `400 Bad Request` | `404 Not Found`

#### Create User

- **POST** `/user`
- **Body**: `{ "login": "string", "password": "string" }`
- **Response**: `201 Created` - User object | `400 Bad Request`

#### Update Password

- **PUT** `/user/:id`
- **Body**: `{ "oldPassword": "string", "newPassword": "string" }`
- **Response**: `200 OK` - Updated user | `400 Bad Request` | `403 Forbidden` | `404 Not Found`

#### Delete User

- **DELETE** `/user/:id`
- **Response**: `204 No Content` | `400 Bad Request` | `404 Not Found`

### Artists (Protected)

#### Get All Artists

- **GET** `/artist`
- **Response**: `200 OK` - Array of artists

#### Get Artist by ID

- **GET** `/artist/:id`
- **Response**: `200 OK` - Artist object | `400 Bad Request` | `404 Not Found`

#### Create Artist

- **POST** `/artist`
- **Body**: `{ "name": "string", "grammy": boolean }`
- **Response**: `201 Created` - Artist object | `400 Bad Request`

#### Update Artist

- **PUT** `/artist/:id`
- **Body**: `{ "name": "string", "grammy": boolean }`
- **Response**: `200 OK` - Updated artist | `400 Bad Request` | `404 Not Found`

#### Delete Artist

- **DELETE** `/artist/:id`
- **Response**: `204 No Content` | `400 Bad Request` | `404 Not Found`
- **Note**: Removes artist from favorites and nullifies references in albums and tracks

### Albums (Protected)

#### Get All Albums

- **GET** `/album`
- **Response**: `200 OK` - Array of albums

#### Get Album by ID

- **GET** `/album/:id`
- **Response**: `200 OK` - Album object | `400 Bad Request` | `404 Not Found`

#### Create Album

- **POST** `/album`
- **Body**: `{ "name": "string", "year": number, "artistId": "uuid|null" }`
- **Response**: `201 Created` - Album object | `400 Bad Request`

#### Update Album

- **PUT** `/album/:id`
- **Body**: `{ "name": "string", "year": number, "artistId": "uuid|null" }`
- **Response**: `200 OK` - Updated album | `400 Bad Request` | `404 Not Found`

#### Delete Album

- **DELETE** `/album/:id`
- **Response**: `204 No Content` | `400 Bad Request` | `404 Not Found`
- **Note**: Removes album from favorites and nullifies references in tracks

### Tracks (Protected)

#### Get All Tracks

- **GET** `/track`
- **Response**: `200 OK` - Array of tracks

#### Get Track by ID

- **GET** `/track/:id`
- **Response**: `200 OK` - Track object | `400 Bad Request` | `404 Not Found`

#### Create Track

- **POST** `/track`
- **Body**: `{ "name": "string", "duration": number, "artistId": "uuid|null", "albumId": "uuid|null" }`
- **Response**: `201 Created` - Track object | `400 Bad Request`

#### Update Track

- **PUT** `/track/:id`
- **Body**: `{ "name": "string", "duration": number, "artistId": "uuid|null", "albumId": "uuid|null" }`
- **Response**: `200 OK` - Updated track | `400 Bad Request` | `404 Not Found`

#### Delete Track

- **DELETE** `/track/:id`
- **Response**: `204 No Content` | `400 Bad Request` | `404 Not Found`
- **Note**: Removes track from favorites

### Favorites (Protected)

#### Get All Favorites

- **GET** `/favs`
- **Response**: `200 OK` - `{ "artists": Artist[], "albums": Album[], "tracks": Track[] }`

#### Add Artist to Favorites

- **POST** `/favs/artist/:id`
- **Response**: `201 Created` | `400 Bad Request` | `422 Unprocessable Entity`

#### Remove Artist from Favorites

- **DELETE** `/favs/artist/:id`
- **Response**: `204 No Content` | `400 Bad Request` | `404 Not Found`

#### Add Album to Favorites

- **POST** `/favs/album/:id`
- **Response**: `201 Created` | `400 Bad Request` | `422 Unprocessable Entity`

#### Remove Album from Favorites

- **DELETE** `/favs/album/:id`
- **Response**: `204 No Content` | `400 Bad Request` | `404 Not Found`

#### Add Track to Favorites

- **POST** `/favs/track/:id`
- **Response**: `201 Created` | `400 Bad Request` | `422 Unprocessable Entity`

#### Remove Track from Favorites

- **DELETE** `/favs/track/:id`
- **Response**: `204 No Content` | `400 Bad Request` | `404 Not Found`

## Testing

### Run all tests (without authorization)

### ⚠️ To check tests without authorization, please comment the TODO lines in the files:

    src/albums/albums.controller.ts
    src/artists/artists.controller.ts
    src/favorites/favorites.controller.ts
    src/tracks/tracks.controller.ts
    src/users/users/controller.ts

```bash
npm run test
```

### Run tests with authorization

```bash
npm run test:auth
```

### Run specific test suite

```bash
npm run test -- <path-to-suite>
```

### Run refresh token tests

```bash
npm run test:refresh
```

## Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Project Structure

```
src/
├── albums/                 # Album module
│   ├── dto/
│   ├── entities/
│   ├── albums.controller.ts
│   ├── albums.service.ts
│   └── albums.module.ts
├── artists/                # Artist module
│   ├── dto/
│   ├── entities/
│   ├── artists.controller.ts
│   ├── artists.service.ts
│   └── artists.module.ts
├── auth/                   # Authentication module
│   ├── dto/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── favorites/              # Favorites module
│   ├── entities/
│   ├── favorites.controller.ts
│   ├── favorites.service.ts
│   └── favorites.module.ts
├── tracks/                 # Track module
│   ├── dto/
│   ├── entities/
│   ├── tracks.controller.ts
│   ├── tracks.service.ts
│   └── tracks.module.ts
├── users/                  # User module
│   ├── dto/
│   ├── entities/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── app.controller.ts       # Root controller
├── app.service.ts          # Root service
├── app.module.ts           # Root module
└── main.ts                 # Application entry point
```

## Key Implementation Details

### Authentication Flow

1. User signs up via `/auth/signup`
2. User logs in via `/auth/login` and receives access and refresh tokens
3. Access token is used for API requests (valid for 1 hour by default)
4. When access token expires, use refresh token at `/auth/refresh` to get new token pair
5. All protected endpoints require `Authorization: Bearer <access-token>` header

### Cascade Deletion

When entities are deleted:

- **Artist deletion**:
  - Sets `artistId` to `null` in related albums and tracks
  - Removes artist from favorites
- **Album deletion**:
  - Sets `albumId` to `null` in related tracks
  - Removes album from favorites
- **Track deletion**:
  - Removes track from favorites

### Validation Rules

- **User login**: Required string
- **User password**: Required string (hashed with bcrypt)
- **Artist name**: Required string
- **Artist grammy**: Required boolean
- **Album name**: Required string
- **Album year**: Required number
- **Track name**: Required string
- **Track duration**: Required number (in seconds)
- **All IDs**: Must be valid UUID v4 format

### Security Features

- Passwords are hashed using bcrypt with configurable salt rounds
- JWT tokens with separate secrets for access and refresh tokens
- Password field is always excluded from API responses
- All routes (except auth) are protected with JWT guard

## Debugging

### VSCode Debugging

Press **F5** to start debugging.

For more information about debugging in VSCode, visit: https://code.visualstudio.com/docs/editor/debugging

## Future Enhancements

The current implementation uses in-memory storage. The architecture is designed to easily migrate to:

- PostgreSQL with TypeORM
- MongoDB with Mongoose
- Any other database solution

Simply replace the service layer implementations while keeping the same interfaces.
