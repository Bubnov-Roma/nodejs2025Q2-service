# Contributing Guide

Thank you for considering contributing to Home Library Service! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Project Structure](#project-structure)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to a positive environment**:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Examples of unacceptable behavior**:

- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission

---

## Getting Started

### Prerequisites

- Node.js >= 22.14.0
- Docker Desktop (recommended)
- Git
- Code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:

```bash
git clone git@github.com:YOUR_USERNAME/nodejs2025Q2-service.git
cd nodejs2025Q2-service
```

3. Add upstream remote:

```bash
git remote add upstream git@github.com:Bubnov-Roma/nodejs2025Q2-service.git
```

### Setup Development Environment

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env.local
```

3. Start PostgreSQL:

```bash
npm run docker:postgres
```

4. Run migrations:

```bash
npx prisma migrate dev
```

5. Start development server:

```bash
npm run start:dev
```

---

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feat/my-new-feature
```

**Branch naming conventions**:

- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Changes

Follow these guidelines:

- Write clear, self-documenting code
- Add comments for complex logic
- Update documentation if needed
- Follow the [Code Style](#code-style) guide

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm run test
npm run test:auth
```

### 4. Commit Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add user profile endpoint"
```

**Commit message format**:

```
<type>: <subject>

<body>

<footer>
```

**Types**:

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting changes
- `refactor` - Code refactoring
- `test` - Test updates
- `chore` - Maintenance

**Examples**:

```bash
# Good
git commit -m "feat: add JWT refresh token rotation"
git commit -m "fix: resolve database connection timeout"
git commit -m "docs: update API endpoints documentation"

# Bad
git commit -m "fixed stuff"
git commit -m "update"
```

### 5. Keep Your Branch Updated

```bash
# Fetch latest changes
git fetch upstream

# Rebase your branch
git rebase upstream/main
```

### 6. Push to Your Fork

```bash
git push origin feat/my-new-feature
```

---

## Code Style

### TypeScript Guidelines

1. **Use TypeScript strict mode**:

```typescript
// Good
const user: User = await findUser(id);

// Avoid
const user: any = await findUser(id);
```

2. **Define interfaces for data structures**:

```typescript
interface CreateUserDto {
  login: string;
  password: string;
}
```

3. **Use meaningful variable names**:

```typescript
// Good
const authenticatedUser = await validateToken(token);

// Bad
const u = await validateToken(token);
```

### NestJS Conventions

1. **Use dependency injection**:

```typescript
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
}
```

2. **Follow module structure**:

```
module/
├── dto/
│   └── create-entity.dto.ts
├── entity.controller.ts
├── entity.service.ts
└── entity.module.ts
```

3. **Use decorators appropriately**:

```typescript
@Controller('user')
export class UsersController {
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    // ...
  }
}
```

### Code Formatting

We use Prettier for consistent formatting:

```bash
npm run format
```

**Prettier config** (`.prettierrc`):

```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

### ESLint Rules

Run linter before committing:

```bash
npm run lint
npm run lint -- --fix  # Auto-fix issues
```

---

## Testing

### Writing Tests

1. **Test file naming**:

```
users.service.spec.ts    # Unit tests
users.e2e.spec.ts        # E2E tests
```

2. **Test structure**:

```typescript
describe('UsersService', () => {
  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto = { login: 'test', password: 'pass' };

      // Act
      const user = await service.create(createUserDto);

      // Assert
      expect(user).toBeDefined();
      expect(user.login).toBe('test');
    });
  });
});
```

3. **Test coverage**:
   - Aim for > 80% coverage
   - Test both success and error cases
   - Include edge cases

### Running Tests

```bash
# All tests
npm run test

# With authorization
npm run test:auth

# Specific test file
npm run test -- users.e2e.spec.ts

# With coverage
npm run test -- --coverage
```

### Test Best Practices

1. **Each test should be independent**
2. **Clean up after tests** (delete test data)
3. **Use descriptive test names**
4. **Mock external dependencies**
5. **Test error scenarios**

---

## Submitting Changes

### Pull Request Process

1. **Ensure all tests pass**:

```bash
npm run lint
npm run format
npm run test
npm run test:auth
```

2. **Update documentation** if needed:
   - Update API_ENDPOINTS.md for API changes
   - Update README.md for feature changes
   - Add/update JSDoc comments

3. **Create Pull Request**:
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] All tests pass
- [ ] New tests added
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings

## Related Issues

Closes #123
```

### PR Review Process

1. **Automated checks** must pass:
   - Linting
   - Tests
   - Build

2. **Code review** by maintainers:
   - At least 1 approval required
   - Address review comments

3. **Merge**:
   - Squash and merge preferred
   - Update your local main:
   ```bash
   git checkout main
   git pull upstream main
   ```

---

## Project Structure

### Directory Organization

```
src/
├── albums/          # Album management
├── artists/         # Artist management
├── auth/            # Authentication & JWT
├── common/          # Shared utilities
│   ├── filters/     # Exception filters
│   ├── interceptors/# HTTP interceptors
│   └── logging/     # Logging service
├── favorites/       # Favorites management
├── prisma/          # Prisma ORM module
├── tracks/          # Track management
├── users/           # User management
└── main.ts          # Application entry
```

### Adding New Features

#### Example: Adding a New Entity

1. **Create module directory**:

```bash
mkdir src/playlists
cd src/playlists
```

2. **Create DTO**:

```typescript
// dto/create-playlist.dto.ts
export class CreatePlaylistDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

3. **Create service**:

```typescript
// playlists.service.ts
@Injectable()
export class PlaylistsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePlaylistDto) {
    return this.prisma.playlist.create({ data: dto });
  }
}
```

4. **Create controller**:

```typescript
// playlists.controller.ts
@Controller('playlist')
@UseGuards(JwtAuthGuard)
export class PlaylistsController {
  constructor(private service: PlaylistsService) {}

  @Post()
  create(@Body() dto: CreatePlaylistDto) {
    return this.service.create(dto);
  }
}
```

5. **Create module**:

```typescript
// playlists.module.ts
@Module({
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
})
export class PlaylistsModule {}
```

6. **Register in AppModule**:

```typescript
// app.module.ts
@Module({
  imports: [
    // ...
    PlaylistsModule,
  ],
})
export class AppModule {}
```

7. **Add Prisma schema**:

```prisma
// prisma/schema.prisma
model Playlist {
  id          String   @id @default(uuid())
  name        String
  description String?
  createdAt   BigInt   @default(dbgenerated("..."))

  @@map("playlists")
}
```

8. **Create migration**:

```bash
npx prisma migrate dev --name add_playlists
```

9. **Write tests**:

```typescript
// playlists.e2e.spec.ts
describe('Playlists (e2e)', () => {
  it('should create playlist', async () => {
    // Test implementation
  });
});
```

10. **Update documentation**:
    - Add endpoints to API_ENDPOINTS.md
    - Update PROJECT_STRUCTURE.md
    - Add to Postman collection

---

## Common Tasks

### Adding API Endpoint

1. Add route to controller
2. Implement service method
3. Add DTO validation
4. Write tests
5. Update API documentation
6. Add to Postman collection

### Database Changes

1. Update Prisma schema
2. Create migration:

```bash
npx prisma migrate dev --name descriptive_name
```

3. Generate Prisma Client:

```bash
npx prisma generate
```

4. Update DTOs and interfaces
5. Update services to use new schema

### Adding Environment Variable

1. Add to `.env.example`
2. Document in SETUP_INSTRUCTIONS.md
3. Use via ConfigService:

```typescript
constructor(private config: ConfigService) {}

const value = this.config.get<string>('VAR_NAME');
```

---

## Questions?

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Ask in GitHub Discussions
- Open an issue for bugs

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (UNLICENSED).

---

Thank you for contributing! 🎉
