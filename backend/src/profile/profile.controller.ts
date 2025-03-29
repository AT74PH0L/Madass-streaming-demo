import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

@Controller('profile')
@UseGuards(AuthGuard, RolesGuard)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Roles(Role.User, Role.Admin, Role.Creator)
  async profile(@Req() req: Request) {
    const { access_token } = req.cookies;
    const token: string = access_token as string;
    const claim = await this.authService.verifyAccessToken(token);
    if (!claim) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
    const userId = claim.sub;
    const user = await this.profileService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return {
      id: user.id,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      picture: user.picture,
      role: user.role,
    };
  }
}
