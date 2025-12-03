## Project structure

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
