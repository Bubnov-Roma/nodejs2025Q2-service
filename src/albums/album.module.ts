import { forwardRef, Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { Favorite } from 'src/favorites/entities/favorites.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album, Track, Favorite]),
    forwardRef(() => TracksModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
