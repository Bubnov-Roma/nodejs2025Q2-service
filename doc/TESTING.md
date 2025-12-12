# Testing Guide

Complete guide for testing the Home Library Service.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Suites](#test-suites)
- [Running Tests](#running-tests)
- [Testing with Postman](#testing-with-postman)
- [Code Quality](#code-quality)
- [Writing Tests](#writing-tests)

---

## Quick Start

### Prerequisites

Ensure the application is **not running** before executing tests (tests will start their own instance).

### Run All Tests

```bash
# Without authorization (basic functionality)
npm run test

# With authorization (JWT protected routes)
npm run test:auth

# Refresh token tests
npm run test:refresh
```

---

## Test Suites

### 1. Basic Functionality Tests (Without Auth)

Tests core CRUD operations without JWT authentication.

**⚠️ Important**: To run these tests, comment out the `@UseGuards(JwtAuthGuard)` decorators in:

- `src/albums/albums.controller.ts`
- `src/artists/artists.controller.ts`
- `src/favorites/favorites.controller.ts`
- `src/tracks/tracks.controller.ts`
- `src/users/users.controller.ts`

**Run**:

```bash
npm run test
```

**Test Files**:

- `test/users.e2e.spec.ts`
- `test/artists.e2e.spec.ts`
- `test/albums.e2e.spec.ts`
- `test/tracks.e2e.spec.ts`
- `test/favorites.e2e.spec.ts`

---

### 2. Authorization Tests

Tests that protected endpoints require valid JWT tokens.

**Run**:

```bash
npm run test:auth
```

**Test Files**:

- `test/auth/users.e2e.spec.ts`
- `test/auth/artists.e2e.spec.ts`
- `test/auth/albums.e2e.spec.ts`
- `test/auth/tracks.e2e.spec.ts`
- `test/auth/favorites.e2e.spec.ts`

**What is tested**:

- Endpoints return 401 without token
- Endpoints are accessible with valid token
- Token validation works correctly

---

### 3. Refresh Token Tests

Tests token refresh functionality.

**Run**:

```bash
npm run test:refresh
```

**Test File**: `test/refresh/refresh.e2e.spec.ts`

**What is tested**:

- Getting new token pair with valid refresh token
- Rejection of invalid refresh tokens
- Rejection of expired refresh tokens
- Token payload validation

---

### 4. Specific Test Suite

Run tests for a specific module:

```bash
npm run test -- test/users.e2e.spec.ts
npm run test -- test/artists.e2e.spec.ts
npm run test -- test/albums.e2e.spec.ts
npm run test -- test/tracks.e2e.spec.ts
npm run test -- test/favorites.e2e.spec.ts
```

---

## Running Tests

### Environment Setup

Tests use the same `.env` configuration as the application.

**Default test configuration**:

```env
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/home_library?schema=public"
```

### Test Mode

Set test mode via environment variable:

```bash
# Without authorization
npm run test

# With authorization
TEST_MODE=auth npm run test
# or
npm run test:auth
```

### Test Output

Tests provide detailed output:

- ✅ Passed tests (green)
- ❌ Failed tests (red)
- Test execution time
- HTTP response codes
- Validation results

---

## Testing with Postman

### Setup

1. **Install Postman**:
   - [Download Postman Desktop](https://www.postman.com/downloads/)
   - Or use [Postman Web](https://web.postman.com/)

2. **Import Collection**:
   - Open Postman
   - Click "Import" (top left)
   - Drag and drop `doc/Home_Library.postman_collection.json`
   - Or select via file manager

3. **Configure Base URL**:
   - Open collection → Variables tab
   - Set `baseUrl` = `http://localhost:4000`
   - Save changes

### Testing Workflow

#### 1. Authentication Flow

**Step 1**: Create User (Signup)

```
POST {{baseUrl}}/auth/signup
Body:
{
  "login": "testuser",
  "password": "testpass123"
}
```

**Step 2**: Login

```
POST {{baseUrl}}/auth/login
Body:
{
  "login": "testuser",
  "password": "testpass123"
}
```

Save the returned `accessToken` and `refreshToken`.

**Step 3**: Set Token for Protected Requests

Add to request headers:

```
Authorization: Bearer <accessToken>
```

Or use Postman's Authorization tab → Type: Bearer Token

#### 2. Test Protected Endpoints

**Get All Users**:

```
GET {{baseUrl}}/user
Headers:
  Authorization: Bearer <accessToken>
```

**Create Artist**:

```
POST {{baseUrl}}/artist
Headers:
  Authorization: Bearer <accessToken>
Body:
{
  "name": "Queen",
  "grammy": true
}
```

#### 3. Test Token Refresh

```
POST {{baseUrl}}/auth/refresh
Body:
{
  "refreshToken": "<refreshToken>"
}
```

### Automated Test Runner

Use Collection Runner for automated testing:

1. **Import Test Run**:
   - Import `doc/Home_Library_Service.postman_test_run.json`

2. **Run Collection**:
   - Click "Runner" button
   - Select "Home Library Service" collection
   - Click "Run Home Library Service"

3. **View Results**:
   - See passed/failed tests
   - Check response times
   - Validate assertions

### Postman Test Scripts

The collection includes automated tests:

**Example** (Create User):

```javascript
pm.test('Status code is 201', function () {
  pm.response.to.have.status(201);
});

pm.test('User created successfully', function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('id');
  pm.expect(jsonData).to.have.property('login');
  pm.expect(jsonData).to.not.have.property('password');
  pm.environment.set('userId', jsonData.id);
});
```

---

## Code Quality

### Linting

Check code style and potential issues:

```bash
npm run lint
```

Fix automatically:

```bash
npm run lint -- --fix
```

### Formatting

Format code with Prettier:

```bash
npm run format
```

Configuration: `.prettierrc`

```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

---

## Writing Tests

### Test Structure

Tests use Jest and Supertest:

```typescript
import { request } from './lib';
import { StatusCodes } from 'http-status-codes';
import { usersRoutes } from './endpoints';

describe('Users (e2e)', () => {
  const commonHeaders = { Accept: 'application/json' };

  it('should create user', async () => {
    const response = await request
      .post(usersRoutes.create)
      .set(commonHeaders)
      .send({
        login: 'testuser',
        password: 'testpass123',
      });

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toHaveProperty('id');
  });
});
```

### Test Utilities

**Available utilities** (in `test/utils/`):

- `getTokenAndUserId()` - Get authentication tokens
- `removeTokenUser()` - Clean up test users
- `generateRefreshToken()` - Generate test refresh tokens
- `shouldAuthorizationBeTested` - Check if auth tests are enabled

### Authentication in Tests

For protected endpoints:

```typescript
let token: string;
let userId: string;

beforeAll(async () => {
  const result = await getTokenAndUserId(request);
  token = result.token;
  userId = result.mockUserId;
});

afterAll(async () => {
  await removeTokenUser(request, userId, { Authorization: token });
});

it('should access protected route', async () => {
  const response = await request.get('/user').set('Authorization', token);

  expect(response.status).toBe(StatusCodes.OK);
});
```

### Best Practices

1. **Clean Up**: Always delete test data in `afterAll()`
2. **Isolation**: Each test should be independent
3. **Clear Names**: Use descriptive test names
4. **Assertions**: Test both success and error cases
5. **Mock Data**: Use consistent test data

### Common Test Patterns

**Test CRUD Operations**:

```typescript
describe('CRUD', () => {
  it('should create entity', async () => {
    /* ... */
  });
  it('should read entity', async () => {
    /* ... */
  });
  it('should update entity', async () => {
    /* ... */
  });
  it('should delete entity', async () => {
    /* ... */
  });
});
```

**Test Validations**:

```typescript
it('should validate required fields', async () => {
  const responses = await Promise.all([
    request.post('/user').send({}),
    request.post('/user').send({ login: 'test' }),
    request.post('/user').send({ password: 'test' }),
  ]);

  responses.forEach((res) => {
    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
```

**Test Authorization**:

```typescript
it('should require authentication', async () => {
  const response = await request.get('/user');
  expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
});
```

---

## Test Coverage

### Run with Coverage

```bash
npm run test -- --coverage
```

### Coverage Reports

Coverage reports are generated in `coverage/` directory:

- `coverage/lcov-report/index.html` - HTML report
- `coverage/lcov.info` - LCOV format

### Coverage Goals

Target coverage levels:

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

---

## Continuous Integration

Tests are automatically run on:

- Pull requests
- Main branch commits
- Release tags

See `.github/workflows/` for CI configuration.

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 4000
# Linux/macOS
lsof -ti:4000 | xargs kill -9

# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Database Connection Issues

```bash
# Reset database
npm run docker:clean
npm run docker:postgres
npx prisma migrate deploy
```

### Test Timeout

Increase timeout in test:

```typescript
jest.setTimeout(30000); // 30 seconds
```

### Prisma Not Generated

```bash
npx prisma generate
```

---

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Postman Learning](https://learning.postman.com/)
