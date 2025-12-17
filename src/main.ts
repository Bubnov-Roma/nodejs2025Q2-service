import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CustomLoggingService } from './common/logging/logging.service';

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(CustomLoggingService);
  app.useLogger(logger);

  app.useGlobalFilters(new AllExceptionsFilter(logger));

  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  process.on('uncaughtException', (error: Error) => {
    logger.error(
      {
        type: 'uncaughtException',
        message: error.message,
      },
      error.stack,
      'Process',
    );
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error(
      {
        type: 'unhandledRejection',
        reason: reason?.message || reason,
        promise: promise.toString(),
      },
      reason?.stack,
      'Process',
    );
  });

  process.on('SIGTERM', () => {
    logger.warn('SIGTERM signal received: closing HTTP server', 'Process');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.warn('SIGINT signal received: closing HTTP server', 'Process');
    process.exit(0);
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(
    `🚀 Application is running on: \x1b[32mhttp://localhost:${port}\x1b[0m`,
    'Bootstrap',
  );

  logger.log(`📝 Logging level: ${process.env.LOG_LEVEL || '3'}`, 'Bootstrap');
  logger.log(
    `📦 Max log file size: ${process.env.MAX_LOG_FILE_SIZE || '5120'}KB`,
    'Bootstrap',
  );
  logger.log(
    `⚠️ To check tests without authorization, please comment \x1b[33mTODO:\x1b[0m lines in the next files:
    \x1b[34m./albums/albums.controller.ts 
    ./artists/artists.controller.ts
    ./favorites/favorites.controller.ts
    ./tracks/tracks.controller.ts
    ./users/users.controller.ts\x1b[0m`,
    'Bootstrap',
  );
}
bootstrap();
