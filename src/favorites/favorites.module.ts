import { Module, forwardRef } from '@nestjs/common';
import { AlbumsModule } from 'src/albums/album.module';
import { ArtistsModule } from 'src/artists/artists.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from 'src/database/entities/artist.entity';
import { Album } from 'src/database/entities/album.entity';
import { Track } from 'src/database/entities/track.entity';
import { Favorite } from '../database/entities/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, Artist, Album, Track]),
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
