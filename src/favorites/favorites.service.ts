import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Favorite } from '../database/entities/favorite.entity';
import { Artist } from '../database/entities/artist.entity';
import { Album } from '../database/entities/album.entity';
import { Track } from '../database/entities/track.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
  ) {}

  async getFavorites() {
    const favorites = await this.favoritesRepository.find();

    const artistIds = favorites
      .filter((f) => f.entityType === 'artist')
      .map((f) => f.entityId);
    const albumIds = favorites
      .filter((f) => f.entityType === 'album')
      .map((f) => f.entityId);
    const trackIds = favorites
      .filter((f) => f.entityType === 'track')
      .map((f) => f.entityId);

    const artists =
      artistIds.length > 0
        ? await this.artistsRepository.find({ where: { id: In(artistIds) } })
        : [];
    const albums =
      albumIds.length > 0
        ? await this.albumsRepository.find({ where: { id: In(albumIds) } })
        : [];
    const tracks =
      trackIds.length > 0
        ? await this.tracksRepository.find({ where: { id: In(trackIds) } })
        : [];

    return { artists, albums, tracks };
  }

  async addArtist(id: string): Promise<void> {
    const artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist) {
      throw new UnprocessableEntityException('Artist does not exist');
    }

    const existing = await this.favoritesRepository.findOne({
      where: { entityId: id, entityType: 'artist' },
    });

    if (!existing) {
      const favorite = this.favoritesRepository.create({
        entityId: id,
        entityType: 'artist',
      });
      await this.favoritesRepository.save(favorite);
    }
  }

  async removeArtist(id: string): Promise<void> {
    const result = await this.favoritesRepository.delete({
      entityId: id,
      entityType: 'artist',
    });
    if (result.affected === 0) {
      throw new NotFoundException('Artist not found in favorites');
    }
  }

  async addAlbum(id: string): Promise<void> {
    const album = await this.albumsRepository.findOne({ where: { id } });
    if (!album) {
      throw new UnprocessableEntityException('Album does not exist');
    }

    const existing = await this.favoritesRepository.findOne({
      where: { entityId: id, entityType: 'album' },
    });

    if (!existing) {
      const favorite = this.favoritesRepository.create({
        entityId: id,
        entityType: 'album',
      });
      await this.favoritesRepository.save(favorite);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const result = await this.favoritesRepository.delete({
      entityId: id,
      entityType: 'album',
    });
    if (result.affected === 0) {
      throw new NotFoundException('Album not found in favorites');
    }
  }

  async addTrack(id: string): Promise<void> {
    const track = await this.tracksRepository.findOne({ where: { id } });
    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }

    const existing = await this.favoritesRepository.findOne({
      where: { entityId: id, entityType: 'track' },
    });

    if (!existing) {
      const favorite = this.favoritesRepository.create({
        entityId: id,
        entityType: 'track',
      });
      await this.favoritesRepository.save(favorite);
    }
  }

  async removeTrack(id: string): Promise<void> {
    const result = await this.favoritesRepository.delete({
      entityId: id,
      entityType: 'track',
    });
    if (result.affected === 0) {
      throw new NotFoundException('Track not found in favorites');
    }
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    await this.favoritesRepository.delete({
      entityId: artistId,
      entityType: 'artist',
    });
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    await this.favoritesRepository.delete({
      entityId: albumId,
      entityType: 'album',
    });
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    await this.favoritesRepository.delete({
      entityId: trackId,
      entityType: 'track',
    });
  }
}
