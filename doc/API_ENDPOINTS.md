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
