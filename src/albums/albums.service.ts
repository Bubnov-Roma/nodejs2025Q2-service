import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './entities/album.entity';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/create-album.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AlbumsService {
  private albums: Album[] = [];

  create(createAlbumDto: CreateAlbumDto): Album {
    const album: Album = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    this.albums.push(album);
    return album;
  }

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    const album = this.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const album = this.findOne(id);
    Object.assign(album, {
      name: updateAlbumDto.name,
      year: updateAlbumDto.year,
      artistId: updateAlbumDto.artistId || null,
    });
    return album;
  }

  remove(id: string): void {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Album not found');
    }
    this.albums.splice(index, 1);
  }

  nullifyArtistId(artistId: string): void {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
