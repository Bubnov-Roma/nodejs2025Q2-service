# API Endpoints Reference

Complete API reference for the Home Library Service.

**Base URL**: `http://localhost:4000`

**Authentication**: Most endpoints require JWT Bearer token (except public auth endpoints).

---

## Table of Contents

- [Authentication (Public)](#authentication-public)
- [Users (Protected)](#users-protected)
- [Artists (Protected)](#artists-protected)
- [Albums (Protected)](#albums-protected)
- [Tracks (Protected)](#tracks-protected)
- [Favorites (Protected)](#favorites-protected)
- [Common Error Responses](#common-error-responses)

---

## Authentication (Public)

### Sign Up

Create a new user account.

**Endpoint**: `POST /auth/signup`

**Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "login": "string (3-255 chars)",
  "password": "string (3-30 chars)"
}
```

**Success Response**: `201 Created`

```json
{
  "id": "uuid",
  "login": "username",
  "version": 1,
  "createdAt": 1702345678000,
  "updatedAt": 1702345678000
}
```

**Error Responses**:

- `400 Bad Request` - Invalid request body
- `409 Conflict` - Login already exists

---

### Login

Authenticate and receive JWT tokens.

**Endpoint**: `POST /auth/login`

**Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "login": "string",
  "password": "string"
}
```

**Success Response**: `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:

- `400 Bad Request` - Missing login or password
- `403 Forbidden` - Incorrect login or password

---

### Refresh Token

Obtain new access and refresh tokens.

**Endpoint**: `POST /auth/refresh`

**Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "refreshToken": "string"
}
```

**Success Response**: `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:

- `401 Unauthorized` - Refresh token not provided
- `403 Forbidden` - Invalid or expired refresh token

---

## Users (Protected)

All user endpoints require Bearer authentication token.

### Get All Users

**Endpoint**: `GET /user`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Success Response**: `200 OK`

```json
[
  {
    "id": "uuid",
    "login": "username",
    "version": 1,
    "createdAt": 1702345678000,
    "updatedAt": 1702345678000
  }
]
```

---

### Get User by ID

**Endpoint**: `GET /user/:id`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**URL Parameters**:

- `id` (uuid) - User ID

**Success Response**: `200 OK`

```json
{
  "id": "uuid",
  "login": "username",
  "version": 1,
  "createdAt": 1702345678000,
  "updatedAt": 1702345678000
}
```

**Error Responses**:

- `400 Bad Request` - Invalid UUID
- `404 Not Found` - User not found

---

### Create User

**Endpoint**: `POST /user`

**Headers**:

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body**:

```json
{
  "login": "string",
  "password": "string"
}
```

**Success Response**: `201 Created`

**Error Responses**:

- `400 Bad Request` - Invalid request body

---

### Update Password

**Endpoint**: `PUT /user/:id`

**Headers**:

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body**:

```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

**Success Response**: `200 OK`

```json
{
  "id": "uuid",
  "login": "username",
  "version": 2,
  "createdAt": 1702345678000,
  "updatedAt": 1702349278000
}
```

**Error Responses**:

- `400 Bad Request` - Invalid UUID or request body
- `403 Forbidden` - Old password is incorrect
- `404 Not Found` - User not found

---

### Delete User

**Endpoint**: `DELETE /user/:id`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Success Response**: `204 No Content`

**Error Responses**:

- `400 Bad Request` - Invalid UUID
- `404 Not Found` - User not found

---

## Artists (Protected)

### Get All Artists

**Endpoint**: `GET /artist`

**Headers**:

```
Authorization: Bearer <accessToken>
```

**Success Response**: `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Artist Name",
    "grammy": true
  }
]
```

---

### Get Artist by ID

**Endpoint**: `GET /artist/:id`

**Success Response**: `200 OK`

```json
{
  "id": "uuid",
  "name": "Artist Name",
  "grammy": true
}
```

---

### Create Artist

**Endpoint**: `POST /artist`

**Request Body**:

```json
{
  "name": "string",
  "grammy": boolean
}
```

**Success Response**: `201 Created`

---

### Update Artist

**Endpoint**: `PUT /artist/:id`

**Request Body**:

```json
{
  "name": "string",
  "grammy": boolean
}
```

**Success Response**: `200 OK`

---

### Delete Artist

**Endpoint**: `DELETE /artist/:id`

**Success Response**: `204 No Content`

**Note**: Automatically removes artist from favorites and sets `artistId` to `null` in related albums and tracks.

---

## Albums (Protected)

### Get All Albums

**Endpoint**: `GET /album`

**Success Response**: `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Album Name",
    "year": 2022,
    "artistId": "uuid or null"
  }
]
```

---

### Get Album by ID

**Endpoint**: `GET /album/:id`

**Success Response**: `200 OK`

---

### Create Album

**Endpoint**: `POST /album`

**Request Body**:

```json
{
  "name": "string",
  "year": number,
  "artistId": "uuid or null"
}
```

**Success Response**: `201 Created`

---

### Update Album

**Endpoint**: `PUT /album/:id`

**Request Body**:

```json
{
  "name": "string",
  "year": number,
  "artistId": "uuid or null"
}
```

**Success Response**: `200 OK`

---

### Delete Album

**Endpoint**: `DELETE /album/:id`

**Success Response**: `204 No Content`

**Note**: Automatically removes album from favorites and sets `albumId` to `null` in related tracks.

---

## Tracks (Protected)

### Get All Tracks

**Endpoint**: `GET /track`

**Success Response**: `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Track Name",
    "duration": 354,
    "artistId": "uuid or null",
    "albumId": "uuid or null"
  }
]
```

---

### Get Track by ID

**Endpoint**: `GET /track/:id`

**Success Response**: `200 OK`

---

### Create Track

**Endpoint**: `POST /track`

**Request Body**:

```json
{
  "name": "string",
  "duration": number,
  "artistId": "uuid or null",
  "albumId": "uuid or null"
}
```

**Success Response**: `201 Created`

---

### Update Track

**Endpoint**: `PUT /track/:id`

**Request Body**:

```json
{
  "name": "string",
  "duration": number,
  "artistId": "uuid or null",
  "albumId": "uuid or null"
}
```

**Success Response**: `200 OK`

---

### Delete Track

**Endpoint**: `DELETE /track/:id`

**Success Response**: `204 No Content`

**Note**: Automatically removes track from favorites.

---

## Favorites (Protected)

### Get All Favorites

**Endpoint**: `GET /favs`

**Success Response**: `200 OK`

```json
{
  "artists": [
    {
      "id": "uuid",
      "name": "Artist Name",
      "grammy": true
    }
  ],
  "albums": [
    {
      "id": "uuid",
      "name": "Album Name",
      "year": 2022,
      "artistId": "uuid or null"
    }
  ],
  "tracks": [
    {
      "id": "uuid",
      "name": "Track Name",
      "duration": 354,
      "artistId": "uuid or null",
      "albumId": "uuid or null"
    }
  ]
}
```

---

### Add Artist to Favorites

**Endpoint**: `POST /favs/artist/:id`

**Success Response**: `201 Created`

**Error Responses**:

- `400 Bad Request` - Invalid UUID
- `422 Unprocessable Entity` - Artist doesn't exist

---

### Remove Artist from Favorites

**Endpoint**: `DELETE /favs/artist/:id`

**Success Response**: `204 No Content`

**Error Responses**:

- `400 Bad Request` - Invalid UUID
- `404 Not Found` - Artist not in favorites

---

### Add Album to Favorites

**Endpoint**: `POST /favs/album/:id`

**Success Response**: `201 Created`

**Error Responses**:

- `400 Bad Request` - Invalid UUID
- `422 Unprocessable Entity` - Album doesn't exist

---

### Remove Album from Favorites

**Endpoint**: `DELETE /favs/album/:id`

**Success Response**: `204 No Content`

---

### Add Track to Favorites

**Endpoint**: `POST /favs/track/:id`

**Success Response**: `201 Created`

**Error Responses**:

- `400 Bad Request` - Invalid UUID
- `422 Unprocessable Entity` - Track doesn't exist

---

### Remove Track from Favorites

**Endpoint**: `DELETE /favs/track/:id`

**Success Response**: `204 No Content`

---

## Common Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "timestamp": "2025-12-12T10:00:00.000Z",
  "path": "/user/invalid-id",
  "message": "Validation failed"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "timestamp": "2025-12-12T10:00:00.000Z",
  "path": "/user",
  "message": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "timestamp": "2025-12-12T10:00:00.000Z",
  "path": "/auth/login",
  "message": "Incorrect login or password"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "timestamp": "2025-12-12T10:00:00.000Z",
  "path": "/user/uuid",
  "message": "User not found"
}
```

### 422 Unprocessable Entity

```json
{
  "statusCode": 422,
  "timestamp": "2025-12-12T10:00:00.000Z",
  "path": "/favs/artist/uuid",
  "message": "Artist does not exist"
}
```

---

## Notes

- All timestamps are Unix timestamps in milliseconds
- All IDs are UUIDs (v4)
- Duration is measured in seconds
- Password is never returned in responses
- Bearer token format: `Authorization: Bearer <token>`
