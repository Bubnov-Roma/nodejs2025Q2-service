# Logging System Documentation

## Overview

This application implements a comprehensive logging system with the following features:

- Custom logging service with multiple log levels
- HTTP request/response logging
- Global exception handling
- Log rotation by file size
- Separate error log file
- Configurable via environment variables

## Log Levels

The application supports 6 logging levels (configured via `LOG_LEVEL` environment variable):

| Level   | Value | Logs Included                    |
| ------- | ----- | -------------------------------- |
| None    | 0     | No logging                       |
| Error   | 1     | Errors only                      |
| Warn    | 2     | Errors, Warnings                 |
| Log     | 3     | Errors, Warnings, Logs (default) |
| Debug   | 4     | Errors, Warnings, Logs, Debug    |
| Verbose | 5     | All messages                     |

## Configuration

### Environment Variables

```env
# Logging level (0-5)
LOG_LEVEL=3

# Maximum log file size in KB before rotation
MAX_LOG_FILE_SIZE=5120
```

## Log Files

All logs are stored in the `logs/` directory:

- `app.log` - All application logs
- `error.log` - Error logs only
- `app-{timestamp}.log` - Rotated log files

## Log Rotation

When a log file exceeds `MAX_LOG_FILE_SIZE` (in KB), it is automatically rotated:

- Original file is renamed with timestamp: `app-2025-12-10T12-00-00-000Z.log`
- New empty log file is created
- Logging continues without interruption

## Log Format

```
{timestamp} [{LEVEL}] [{context}] {message}
```

Example:

```
2025-12-10T12:00:00.000Z [LOG] [HTTP] {"type":"HTTP_REQUEST","method":"GET","url":"/user","query":{},"body":{}}
```

## Features

### HTTP Logging

- All incoming requests are logged with URL, query parameters, and body
- All responses are logged with status code and duration
- Sensitive fields (passwords, tokens) are automatically redacted

### Exception Handling

- All exceptions are caught and logged
- Appropriate HTTP status codes are sent to clients
- Stack traces are included in error logs

### Process Error Handling

- `uncaughtException` events are logged before process termination
- `unhandledRejection` events are logged
- Graceful shutdown on SIGTERM and SIGINT signals

## Usage in Code

```typescript
import { CustomLoggingService } from './common/logging/logging.service';

@Injectable()
export class YourService {
  constructor(private readonly logger: CustomLoggingService) {}

  someMethod() {
    this.logger.log('Informational message', 'YourService');
    this.logger.error('Error message', stackTrace, 'YourService');
    this.logger.warn('Warning message', 'YourService');
    this.logger.debug('Debug message', 'YourService');
    this.logger.verbose('Verbose message', 'YourService');
  }
}
```

## Testing

Run the application and check the `logs/` directory:

```bash
npm run start:dev
```

Check log files:

```bash
cat logs/app.log
cat logs/error.log
```
