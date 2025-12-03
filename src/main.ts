import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`\n 🚀Application is running on: http://localhost:${port}`);
  console.log(
    '\x1b[32m ⚠️ To check tests without authorization, please comment the \x1b[33mTODO:\x1b[32m lines in the files:\x1b[34m',
    `
    ./albums/albums.controller.ts 
    ./artists/artists.controller.ts
    ./favorites/favorites.controller.ts
    ./tracks/tracks.controller.ts
    ./users/users/controller.ts`,
  );
}
bootstrap();
