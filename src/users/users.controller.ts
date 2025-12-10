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
  // UseGuards /* TODO: needs to be commented out for check tests without authorization */,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { validate as isUUID } from 'uuid';
import { CreateUserDto, UpdatePasswordDto } from './dto/create-user.dto';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; /* TODO: needs to be commented out for check tests without authorization */

@Controller('user')
// @UseGuards(
//   JwtAuthGuard,
// ) /* TODO: needs to be commented out for check tests without authorization */
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
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(({ password: _, ...user }) => user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid userID');
    }
    const user = await this.usersService.findOne(id);
    const { password: _, ...result } = user;
    return result;
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
  async remove(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid userID');
    }
    return await this.usersService.remove(id);
  }
}
