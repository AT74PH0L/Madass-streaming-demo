import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../role.enum';
import { ROLES_KEY } from '../roles.decorator';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const { access_token } = request.cookies;

    if (!access_token) {
      throw new UnauthorizedException('Access token is missing');
    }

    try {
      const payload = await this.authService.verifyAccessToken(
        access_token as string,
      );
      if (!payload) {
        throw new UnauthorizedException('Invalid or expired access token');
      }

      request.user = payload;

      const requiredRoles = this.reflector.get<Role[]>(
        ROLES_KEY,
        context.getHandler(),
      );

      if (!requiredRoles) {
        return true;
      }

      console.log(payload);

      if (!requiredRoles.includes(payload.role)) {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }

      return true;
    } catch (error: unknown) {
      console.error('RolesGuard Error:', error);
      throw error;
    }
  }
}
