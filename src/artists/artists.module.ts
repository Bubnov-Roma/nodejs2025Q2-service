import { forwardRef, Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { AlbumsModule } from 'src/albums/album.module';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from 'src/tracks/entities/track.entity';
import { Artist } from './entities/artist.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Favorite } from 'src/favorites/entities/favorites.entity';

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
