import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto, SignupDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.userService.findByLogin(signupDto.login);
    if (existingUser) {
      throw new ConflictException('Login already exist');
    }

    const { password: _, ...user } = await this.userService.create(signupDto);
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByLogin(loginDto.login);
    if (!user) {
      throw new ForbiddenException('Incorrect login or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Incorrect login or password');
    }

    const payload = { userId: user.id, login: user.login };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('TOKEN_EXPIRE_TIME') ?? '1h',
    } as any);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      expiresIn:
        this.configService.get<string>('TOKEN_REFRESH_EXPIRE_TIME') ?? '24h',
    } as any);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      });

      const newPayLoad = { userId: payload.userId, login: payload.login };
      const accessToken = this.jwtService.sign(newPayLoad, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<string>('TOKEN_EXPIRE_TIME') ?? '1h',
      } as any);

      const newRefreshToken = this.jwtService.sign(newPayLoad, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
        expiresIn:
          this.configService.get<string>('TOKEN_REFRESH_EXPIRE_TIME') ?? '24h',
      } as any);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
