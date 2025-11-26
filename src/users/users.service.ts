import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdatePasswordDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      Number(process.env.CRYPT_SALT) || 10,
    );
    const user: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: hashedPassword,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotImplementedException('User not found');
    }
    return user;
  }

  findByLogin(login: string): User | undefined {
    return this.users.find((u) => u.login === login);
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user = this.findOne(id);

    const isOldPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new NotImplementedException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      Number(process.env.CRYPT_SALT) || 10,
    );
    user.password = hashedNewPassword;
    user.updatedAt = Date.now();
    user.version += 1;

    return user;
  }

  remove(id: string): void {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotImplementedException('User not found');
    }
    this.users.splice(index, 1);
  }
}
