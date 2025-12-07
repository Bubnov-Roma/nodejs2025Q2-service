import { forwardRef, Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from '../database/entities/track.entity';
import { Favorite } from 'src/database/entities/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track, Favorite]),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
