import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  HttpCode,
  UseGuards,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { GoogleProfile } from 'src/auth/dto/google.profile.dto';
import { GitHubProfile } from 'src/auth/dto/github.profile.dto';
import { GoogleOAuthGuard } from 'src/auth/google.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto) {
    const userExist = await this.usersService.findUserByEmail(
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
    return this.usersService.create(createUserDto);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const userExist = await this.usersService.findUserByEmail(loginDto.email);

    if (!userExist) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isMatch = await this.authService.comparePasswords(
      loginDto.password,
      userExist.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.authService.generateToken(userExist);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).send();
  }

  @Get('/author')
  authorization(@Req() req: Request) {
    const { access_token } = req.cookies;
    const token: string = access_token as string;
    if (!access_token) {
      throw new UnauthorizedException('User Unauthorized');
    }
    const claim = this.authService.verifyToken(token);
    if (!claim) {
      throw new UnauthorizedException('User Unauthorized');
    }
    return claim;
  }

  @Get('/logout')
  logut(@Req() req: Request, @Res() res: Response) {
    const { access_token } = req.cookies;
    const token: string = access_token as string;
    if (!access_token) {
      throw new UnauthorizedException('User Unauthorized');
    }
    const claim = this.authService.verifyToken(token);
    if (!claim) {
      throw new UnauthorizedException('User Unauthorized');
    }
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  }

  @Get('/auth/google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // Redirects to Google OAuth
  }

  @Get('/auth/google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const profile: GoogleProfile = req.user as GoogleProfile;
    let user = await this.usersService.findUserByEmail(profile.emails[0].value);
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
        user = await this.usersService.create(createUserDto);
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
    const token = this.authService.generateToken(user);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.redirect(`${process.env.FRONTEND_CALLBACK_URL}`);
  }

  @Get('/auth/github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {
    // Redirects to GitHub for authentication
  }

  @Get('/auth/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const profile: GitHubProfile = req.user as GitHubProfile;
    let user = await this.usersService.findUserByEmail(profile.emails[0].value);
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
        user = await this.usersService.create(createUserDto);
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
    const token = this.authService.generateToken(user);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.redirect(`${process.env.FRONTEND_CALLBACK_URL}`);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
