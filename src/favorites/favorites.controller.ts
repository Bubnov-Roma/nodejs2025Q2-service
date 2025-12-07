import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  // UseGuards /* TODO: needs to be commented out for check tests without authorization */,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { validate as isUUID } from 'uuid';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; /* TODO: needs to be commented out for check tests without authorization */

@Controller('favs')
// @UseGuards(
//   JwtAuthGuard,
// ) /* TODO: needs to be commented out for check tests without authorization */
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getFavorites() {
    return this.favoritesService.getFavorites();
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artist ID');
    }
    this.favoritesService.addArtist(id);
    return { message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid artist ID');
    }
    this.favoritesService.removeArtist(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid album ID');
    }
    this.favoritesService.addAlbum(id);
    return { message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid album ID');
    }
    this.favoritesService.removeAlbum(id);
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID');
    }
    this.favoritesService.addTrack(id);
    return { message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID');
    }
    this.favoritesService.removeTrack(id);
  }
}
