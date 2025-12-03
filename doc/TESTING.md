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

### Check in Postman

- download the [Postman](https://www.postman.com/) application (if you haven't already done so) or try web version

- open Postman

- on the main screen in the left sidebar, select Collection

- click Import (button in the upper left corner)

- drag and drop [the file](./Home_Library.postman_collection.json) or select it through the file manager

- the collection will appear in the left panel

- before starting, make sure that the baseUrl variable is set correctly

- open the collection → Variables tab

- make sure baseUrl = http://localhost:4000 (or your URL)

- run queries in order (top to bottom)

- first create a user, then an artist, an album, etc.

- to run through Collection Runner use [this file](./Home_Library_Service.postman_test_run.json)

## Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```
