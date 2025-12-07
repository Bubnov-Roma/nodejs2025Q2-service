import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getFavorites() {
    const favorites = await this.prisma.favorite.findMany();

    const artistIds = favorites
      .filter((f) => f.entityType === 'artist')
      .map((f) => f.entityId);
    const albumIds = favorites
      .filter((f) => f.entityType === 'album')
      .map((f) => f.entityId);
    const trackIds = favorites
      .filter((f) => f.entityType === 'track')
      .map((f) => f.entityId);

    const [artists, albums, tracks] = await Promise.all([
      artistIds.length > 0
        ? this.prisma.artist.findMany({ where: { id: { in: artistIds } } })
        : [],
      albumIds.length > 0
        ? this.prisma.album.findMany({ where: { id: { in: albumIds } } })
        : [],
      trackIds.length > 0
        ? this.prisma.track.findMany({ where: { id: { in: trackIds } } })
        : [],
    ]);

    return { artists, albums, tracks };
  }

  async addArtist(id: string): Promise<void> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new UnprocessableEntityException('Artist does not exist');
    }

    await this.prisma.favorite.upsert({
      where: {
        entityId_entityType: {
          entityId: id,
          entityType: 'artist',
        },
      },
      update: {},
      create: {
        entityId: id,
        entityType: 'artist',
      },
    });
  }

  async removeArtist(id: string): Promise<void> {
    try {
      await this.prisma.favorite.delete({
        where: {
          entityId_entityType: {
            entityId: id,
            entityType: 'artist',
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Artist not found in favorites');
    }
  }

  async addAlbum(id: string): Promise<void> {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new UnprocessableEntityException('Album does not exist');
    }

    await this.prisma.favorite.upsert({
      where: {
        entityId_entityType: {
          entityId: id,
          entityType: 'album',
        },
      },
      update: {},
      create: {
        entityId: id,
        entityType: 'album',
      },
    });
  }

  async removeAlbum(id: string): Promise<void> {
    try {
      await this.prisma.favorite.delete({
        where: {
          entityId_entityType: {
            entityId: id,
            entityType: 'album',
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Album not found in favorites');
    }
  }

  async addTrack(id: string): Promise<void> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }

    await this.prisma.favorite.upsert({
      where: {
        entityId_entityType: {
          entityId: id,
          entityType: 'track',
        },
      },
      update: {},
      create: {
        entityId: id,
        entityType: 'track',
      },
    });
  }

  async removeTrack(id: string): Promise<void> {
    try {
      await this.prisma.favorite.delete({
        where: {
          entityId_entityType: {
            entityId: id,
            entityType: 'track',
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Track not found in favorites');
    }
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    await this.prisma.favorite.deleteMany({
      where: {
        entityId: artistId,
        entityType: 'artist',
      },
    });
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    await this.prisma.favorite.deleteMany({
      where: {
        entityId: albumId,
        entityType: 'album',
      },
    });
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    await this.prisma.favorite.deleteMany({
      where: {
        entityId: trackId,
        entityType: 'track',
      },
    });
  }
}
