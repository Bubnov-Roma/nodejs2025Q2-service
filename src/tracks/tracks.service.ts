import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto, UpdateTrackDto } from './dto/create-track.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Track } from '@prisma/client';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    return this.prisma.track.create({
      data: {
        name: createTrackDto.name,
        artistId: createTrackDto.artistId || null,
        albumId: createTrackDto.albumId || null,
        duration: createTrackDto.duration,
      },
    });
  }

  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    await this.findOne(id);

    return this.prisma.track.update({
      where: { id },
      data: {
        name: updateTrackDto.name,
        artistId: updateTrackDto.artistId || null,
        albumId: updateTrackDto.albumId || null,
        duration: updateTrackDto.duration,
      },
    });
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.track.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Track not found');
    }
  }

  async nullifyArtistId(artistId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  async nullifyAlbumId(albumId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }
}
