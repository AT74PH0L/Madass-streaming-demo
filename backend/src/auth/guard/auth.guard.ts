import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const { access_token } = request.cookies;

    if (!access_token) {
      throw new UnauthorizedException('Access token is missing');
    }

    const token: string = access_token as string;

    try {
      const payload = this.authService.verifyAccessToken(token);
      request.user = payload;

      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
