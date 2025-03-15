import { Inject, Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Claim } from './dto/claim.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User) private readonly usersRepository: typeof User,
    @Inject('REDIS_CLIENT') private readonly redisCache: Redis,
  ) {}

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hashed: string) {
    return await bcrypt.compare(password, hashed);
  }

  generateAccessToken(user: User) {
    const payload: Claim = {
      sub: user.id,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      picture: user.picture,
      role: user.role,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '5m',
    });
    return token;
  }

  generateRefreshToken(user: User) {
    const payload: Claim = {
      sub: user.id,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      picture: user.picture,
      role: user.role,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_JWT_SECRET,
      expiresIn: '30d',
    });
    return token;
  }

  async verifyAccessToken(token: string) {
    try {
      const payload: Claim = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return payload;
    } catch (error: unknown) {
      let err = 'access_token: ';
      if (error instanceof TokenExpiredError) {
        err += error.message + ' ';
      } else if (error instanceof JsonWebTokenError) {
        err += error.message + ' ';
      }
      console.log(err);
      return null;
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      const payload: Claim = await this.jwtService.verify(token, {
        secret: process.env.REFRESH_JWT_SECRET,
      });
      return payload;
    } catch (error: unknown) {
      let err = 'refresh_token: ';
      if (error instanceof TokenExpiredError) {
        err += error.message + ' ';
      } else if (error instanceof JsonWebTokenError) {
        err += error.message + ' ';
      }
      console.log(err);
      return null;
    }
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email: email } });
  }

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.create({
      displayName: createUserDto.displayName,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      password: createUserDto.password,
      picture: createUserDto.picture,
      role: createUserDto.role,
    });
  }

  async addBlackList(token: string, exp: number) {
    await this.redisCache.set(`blacklist:${token}`, 'revoked', 'EX', exp);
  }

  async isRefreshTokenBlacklisted(token: string) {
    const result = await this.redisCache.get(`blacklist:${token}`);
    return result !== null;
  }
}
