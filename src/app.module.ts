import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AuthModule } from './auth/auth.module';
import { AlbumsModule } from './albums/album.module';
import { Album } from './database/entities/album.entity';
import { Artist } from './database/entities/artist.entity';
import { Favorite } from './database/entities/favorite.entity';
import { Track } from './database/entities/track.entity';
import { User } from './database/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST', 'localhost'),
        port: configService.get('POSTGRES_PORT', 5432),
        username: configService.get('POSTGRES_USER', 'postgres'),
        password: configService.get('POSTGRES_PASSWORD', 'postgres'),
        database: configService.get('POSTGRES_DB', 'home_library'),
        entities: [User, Artist, Album, Track, Favorite],
        synchronize: true,
        logging: true,
        autoLoadEntities: false,
      }),
    }),

    TypeOrmModule.forFeature([User, Artist, Album, Track, Favorite]),

    UsersModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    FavoritesModule,
    AuthModule,
  ],
})
export class AppModule {}
