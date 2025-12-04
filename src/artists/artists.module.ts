import { forwardRef, Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { AlbumsModule } from 'src/albums/album.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from 'src/database/entities/track.entity';
import { Artist } from '../database/entities/artist.entity';
import { Album } from 'src/database/entities/album.entity';
import { Favorite } from 'src/database/entities/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track, Artist, Album, Favorite]),
    forwardRef(() => TracksModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
