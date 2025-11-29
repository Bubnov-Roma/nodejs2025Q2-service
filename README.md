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

## [Setup instructions](./doc/SETUP_INSTRUCTIONS.md)

## [Documentation](./doc/api.yaml)

## [Structure](./doc/PROJECT_STRUCTURE.md)

## [Endpoints](./doc/API_Endpoints.md)

## [Testing](./doc/TESTING.md)

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
