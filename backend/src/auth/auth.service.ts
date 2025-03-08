import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Claim } from './dto/claim.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hashed: string) {
    return await bcrypt.compare(password, hashed);
  }

  generateToken(user: User) {
    const payload: Claim = {
      sub: user.id,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      picture: user.picture,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return token;
  }

  verifyToken(token: string) {
    try {
      const payload: Claim = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
