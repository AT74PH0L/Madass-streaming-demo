import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { access_token } = req.cookies;

    if (!access_token) {
      throw new UnauthorizedException('Access token is missing');
    }

    const token: string = access_token as string;
    const payload = this.authService.verifyAccessToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
    req.user = payload;
    next();
  }
}
