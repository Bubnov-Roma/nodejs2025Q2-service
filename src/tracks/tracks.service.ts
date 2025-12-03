import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from './entities/track.entity';
import { CreateTrackDto, UpdateTrackDto } from './dto/create-track.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto): Track {
    const track: Track = {
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };
    this.tracks.push(track);
    return track;
  }

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    const track = this.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const track = this.findOne(id);
    Object.assign(track, {
      name: updateTrackDto.name,
      artistId: updateTrackDto.artistId || null,
      albumId: updateTrackDto.albumId || null,
      duration: updateTrackDto.duration,
    });
    return track;
  }

  remove(id: string): void {
    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException('Track not found');
    }
    this.tracks.splice(index, 1);
  }

  nullifyArtistId(artistId: string): void {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  nullifyAlbumId(albumId: string): void {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
