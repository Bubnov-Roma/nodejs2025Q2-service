# Authentication & Authorization Guide

## Overview

This application uses JWT (JSON Web Tokens) for authentication and authorization. The system implements both Access and Refresh tokens for secure and seamless user sessions.

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /auth/signup
       ├──────────────────────────────────────────►
       │                                            │
       │ 2. POST /auth/login                        │
       ├──────────────────────────────────────────► ├───────────────┐
       │                                            │ Generate JWT  │
       │ 3. { accessToken, refreshToken }           │ tokens        │
       ◄────────────────────────────────────────────┤◄──────────────┘
       │                                            │
       │ 4. GET /user (+ Authorization header)      │
       ├──────────────────────────────────────────► ├───────────────┐
       │ 5. User data                               │ Verify token  │
       ◄────────────────────────────────────────────┤◄──────────────┘
       │                                            │
       │ 6. POST /auth/refresh (+ refreshToken)     │
       ├──────────────────────────────────────────► ├───────────────┐
       │                                            │ Generate new  │
       │ 7. { accessToken, refreshToken }           │ tokens        │
       ◄────────────────────────────────────────────┤◄──────────────┘
       │                                            │
┌──────┴──────┐                              ┌──────┴──────┐
│   Client    │                              │   Server    │
└─────────────┘                              └─────────────┘
```

## Token Types

### Access Token

- **Purpose**: Used to access protected resources
- **Expiration**: Short-lived (default: 1 hour)
- **Payload**: Contains `userId` and `login`
- **Usage**: Sent in `Authorization` header as `Bearer <token>`

### Refresh Token

- **Purpose**: Used to obtain new Access/Refresh token pairs
- **Expiration**: Long-lived (default: 24 hours)
- **Usage**: Sent in request body to `/auth/refresh`

## Authentication Flow

### 1. User Signup

```bash
POST /auth/signup
Content-Type: application/json

{
  "login": "john_doe",
  "password": "SecurePass123"
}
```

**Response** (201 Created):

```json
{
  "id": "uuid",
  "login": "john_doe",
  "version": 1,
  "createdAt": 1702345678000,
  "updatedAt": 1702345678000
}
```

**Note**: Password is hashed using bcrypt before storing in database.

### 2. User Login

```bash
POST /auth/login
Content-Type: application/json

{
  "login": "john_doe",
  "password": "SecurePass123"
}
```

**Response** (200 OK):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Access Protected Resource

```bash
GET /user
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (200 OK):

```json
[
  {
    "id": "uuid",
    "login": "john_doe",
    "version": 1,
    "createdAt": 1702345678000,
    "updatedAt": 1702345678000
  }
]
```

### 4. Refresh Tokens

When Access Token expires:

```bash
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Protected Routes

All routes **EXCEPT** the following require authentication:

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /` (root)
- `GET /doc` (documentation)

## Error Responses

### 400 Bad Request

Invalid request body (missing login or password):

```json
{
  "statusCode": 400,
  "timestamp": "2025-12-11T10:00:00.000Z",
  "path": "/auth/login",
  "message": "Validation failed"
}
```

### 401 Unauthorized

Missing or invalid Access Token:

```json
{
  "statusCode": 401,
  "timestamp": "2025-12-11T10:00:00.000Z",
  "path": "/user",
  "message": "Unauthorized"
}
```

### 403 Forbidden

Invalid credentials or Refresh Token:

```json
{
  "statusCode": 403,
  "timestamp": "2025-12-11T10:00:00.000Z",
  "path": "/auth/login",
  "message": "Incorrect login or password"
}
```

## JWT Token Structure

### Access Token Payload

```json
{
  "userId": "uuid",
  "login": "john_doe",
  "iat": 1702345678,
  "exp": 1702349278
}
```

### Refresh Token Payload

```json
{
  "userId": "uuid",
  "login": "john_doe",
  "iat": 1702345678,
  "exp": 1702432078
}
```

## Security Best Practices

1. **Never expose tokens in logs**: Tokens are automatically redacted from logs
2. **Use HTTPS in production**: Always use TLS/SSL
3. **Store tokens securely**: Use httpOnly cookies or secure storage
4. **Rotate secrets regularly**: Update JWT_SECRET_KEY periodically
5. **Implement token blacklist**: For logout functionality (future enhancement)

## Configuration

Environment variables in `.env`:

```env
# JWT Configuration
JWT_SECRET_KEY=your_very_long_and_secure_secret_key_here
JWT_SECRET_REFRESH_KEY=your_refresh_token_secret_key_here
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

# Password Hashing
CRYPT_SALT=10
```

## Implementation Details

### Password Hashing

- Algorithm: **bcrypt**
- Salt rounds: Configurable via `CRYPT_SALT` (default: 10)
- Passwords are NEVER stored in plain text

### JWT Strategy

- Algorithm: **HS256** (HMAC with SHA-256)
- Library: `@nestjs/jwt` + `passport-jwt`
- Guard: Custom `JwtAuthGuard` applied globally

### Token Validation

1. Extract token from `Authorization: Bearer <token>` header
2. Verify signature using `JWT_SECRET_KEY`
3. Check expiration time
4. Validate payload structure
5. Extract `userId` and `login` for use in route handlers

## Testing Authentication

See [TESTING.md](TESTING.md) for authentication test examples.

## Troubleshooting

### "Unauthorized" on protected routes

- Ensure Access Token is included in `Authorization` header
- Check token format: `Bearer <token>` (note the space)
- Verify token hasn't expired

### "Invalid refresh token"

- Refresh Token may have expired (24h default)
- Ensure correct secret is used (`JWT_SECRET_REFRESH_KEY`)
- Re-login to obtain new tokens

### "Incorrect login or password"

- Verify credentials are correct
- Check database connection
- Ensure user exists (check with signup first)
