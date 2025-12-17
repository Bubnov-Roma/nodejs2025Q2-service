import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto, UpdateArtistDto } from './dto/create-artist.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Artist } from '@prisma/client';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.prisma.artist.create({
      data: createArtistDto,
    });
  }

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    await this.findOne(id);

    return this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.artist.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Artist not found');
    }
  }
}
