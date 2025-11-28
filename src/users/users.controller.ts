import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { validate as isUUID } from 'uuid';
import { CreateUserDto, UpdatePasswordDto } from './dto/create-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const { password: _, ...user } =
      await this.usersService.create(createUserDto);
    return user;
  }

  @Get()
  findAll() {
    const users = this.usersService.findAll();
    return users.map(({ password: _, ...user }) => user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid userID');
    }
    const { password: _, ...user } = this.usersService.findOne(id);
    return user;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid userID');
    }
    const updatedUser = await this.usersService.update(id, updatePasswordDto);
    const { password: _, ...user } = updatedUser;
    return user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid userID');
    }
    return this.usersService.remove(id);
  }
}
