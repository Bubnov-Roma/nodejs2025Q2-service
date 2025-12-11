import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UseGuards /* TODO: needs to be commented out for check tests without authorization */,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto, UpdateTrackDto } from './dto/create-track.dto';
import { validate as isUUID } from 'uuid';
import { FavoritesService } from 'src/favorites/favorites.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; /* TODO: needs to be commented out for check tests without authorization */

@Controller('track')
@UseGuards(
  JwtAuthGuard,
) /* TODO: needs to be commented out for check tests without authorization */
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID');
    }
    return this.tracksService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID');
    }
    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID');
    }
    await this.favoritesService.removeTrackFromFavorites(id);
    await this.tracksService.remove(id);
  }
}
