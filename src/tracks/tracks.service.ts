import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from '../database/entities/track.entity';
import { CreateTrackDto, UpdateTrackDto } from './dto/create-track.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly tracksRepository: Repository<Track>,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track = this.tracksRepository.create({
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    });
    return await this.tracksRepository.save(track);
  }

  async findAll(): Promise<Track[]> {
    return await this.tracksRepository.find();
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.tracksRepository.findOne({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    await this.findOne(id);
    await this.tracksRepository.update(id, {
      name: updateTrackDto.name,
      artistId: updateTrackDto.artistId || null,
      albumId: updateTrackDto.albumId || null,
      duration: updateTrackDto.duration,
    });
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tracksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Track not found');
    }
  }

  async nullifyArtistId(artistId: string): Promise<void> {
    await this.tracksRepository.update({ artistId }, { artistId: null });
  }

  async nullifyAlbumId(albumId: string): Promise<void> {
    await this.tracksRepository.update({ albumId }, { albumId: null });
  }
}
