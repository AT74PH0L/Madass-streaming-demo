import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { UpdateUserInfo } from './dto/update-userInfo';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Patch()
  async updateUserInfo(
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateUserDto: UpdateUserInfo,
  ) {
    const { access_token } = req.cookies;
    const token: string = access_token as string;
    const claim = await this.authService.verifyAccessToken(token);
    if (!claim) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
    const userId = claim.sub;
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const updatedUser = await this.usersService.update(userId, updateUserDto);
    if (!updatedUser) {
      throw new InternalServerErrorException('Update user failed');
    }
    const accessToken = this.authService.generateAccessToken(updatedUser);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60 * 1000,
    });
    return res.send(updatedUser);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.usersService.remove(id);
  }
}
