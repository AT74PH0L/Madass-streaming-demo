import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guard/google.guard';
import { Request, Response } from 'express';
import { GoogleProfile } from './dto/google.profile.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GitHubProfile } from './dto/github.profile.dto';
import { LoginDto } from '../auth/dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // Redirects to Google OAuth
  }

  @Get('/google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const profile: GoogleProfile = req.user as GoogleProfile;
    let user = await this.authService.findUserByEmail(profile.emails[0].value);
    if (!user) {
      const createUserDto: CreateUserDto = {
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails?.[0]?.value,
        password: '',
        picture: profile.photos?.[0]?.value,
        role: 'user',
      };
      try {
        user = await this.authService.create(createUserDto);
        if (!user) {
          throw new UnauthorizedException('User creation failed');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        throw new BadRequestException(
          'An error occurred while creating the user',
        );
      }
    }
    const access_token = this.authService.generateAccessToken(user);
    const refresh_token = this.authService.generateRefreshToken(user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60 * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${process.env.FRONTEND_CALLBACK_URL}`);
  }

  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {
    // Redirects to GitHub for authentication
  }

  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const profile: GitHubProfile = req.user as GitHubProfile;
    let user = await this.authService.findUserByEmail(profile.emails[0].value);
    if (!user) {
      const createUserDto: CreateUserDto = {
        displayName: profile.username,
        firstName: profile.displayName.split(' ')[0],
        lastName: profile.displayName.split(' ')[1],
        email: profile.emails?.[0]?.value,
        password: '',
        picture: profile.photos?.[0]?.value,
        role: 'user',
      };
      try {
        user = await this.authService.create(createUserDto);
        if (!user) {
          throw new UnauthorizedException('User creation failed');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        throw new BadRequestException(
          'An error occurred while creating the user',
        );
      }
    }
    const access_token = this.authService.generateAccessToken(user);
    const refresh_token = this.authService.generateRefreshToken(user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60 * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.redirect(`${process.env.FRONTEND_CALLBACK_URL}`);
  }

  @Get('/authorization')
  async authorization(@Req() req: Request) {
    const { access_token } = req.cookies;
    const token: string = access_token as string;
    if (!access_token) {
      throw new UnauthorizedException('Access token is missing');
    }
    const claim = await this.authService.verifyAccessToken(token);
    if (!claim) {
      throw new UnauthorizedException('Invalid or expired tokens');
    }

    const userResponse: LoginResponseDto = {
      email: claim.email,
      displayName: claim.displayName,
      picture: claim.picture,
      role: claim.role,
    };
    return userResponse;
  }

  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto) {
    const userExist = await this.authService.findUserByEmail(
      createUserDto.email,
    );

    if (userExist) {
      throw new HttpException('User is duplicate', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await this.authService.hashPassword(
      createUserDto.password,
    );
    createUserDto.password = hashPassword;
    createUserDto.displayName = `${createUserDto.firstName} ${createUserDto.lastName}`;
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const userExist = await this.authService.findUserByEmail(loginDto.email);

    if (!userExist) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const isMatch = await this.authService.comparePasswords(
      loginDto.password,
      userExist.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const access_token = this.authService.generateAccessToken(userExist);
    const refresh_token = this.authService.generateRefreshToken(userExist);
    const userResponse: LoginResponseDto = {
      email: userExist.email,
      displayName: userExist.displayName,
      picture: userExist.picture,
      role: userExist.role,
    };
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60 * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(userResponse).send();
  }

  @Get('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const { access_token, refresh_token } = req.cookies;

    if (!access_token || !refresh_token) {
      throw new UnauthorizedException('Access or Refresh token missing');
    }

    const accessToken: string = access_token as string;
    const refreshToken: string = refresh_token as string;

    const accessClaim = await this.authService.verifyAccessToken(accessToken);
    const refreshClaim =
      await this.authService.verifyRefreshToken(refreshToken);

    if (!refreshClaim) {
      throw new UnauthorizedException('Invalid or expired tokens');
    }
    await this.authService.addBlackList(refreshToken, 30 * 24 * 60 * 60);

    if (!accessClaim) {
      throw new UnauthorizedException('Invalid or expired tokens');
    }

    res.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
    });

    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
  }

  @Get('/refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const token: string = refresh_token as string;
    const payload = await this.authService.verifyRefreshToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (await this.authService.isRefreshTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token is black list');
    }

    const user = await this.authService.findUserByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const access_token = this.authService.generateAccessToken(user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60 * 1000,
    });

    return res.status(200).send();
  }
}
