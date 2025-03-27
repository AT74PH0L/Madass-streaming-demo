import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { RolesGuard } from '../auth/guard/role.guard';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { MovieResponseDto } from './dto/movie-response.dto';

@Controller('movies')
@UseGuards(AuthGuard, RolesGuard)
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @Roles(Role.Creator, Role.Admin)
  async create(@Body() createMovieDto: CreateMovieDto, @Req() req: Request) {
    const { access_token } = req.cookies;
    const token: string = access_token as string;
    const claim = await this.authService.verifyAccessToken(token);
    if (!claim) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
    const userId = claim.sub;
    return this.moviesService.create(userId, createMovieDto);
  }

  @Get()
  @Roles(Role.User, Role.Admin, Role.Creator)
  findAll() {
    return this.moviesService.findAll();
  }

  @Get('/creator')
  @Roles(Role.Admin, Role.Creator)
  async getMoviesOfCreator(@Req() req: Request) {
    const { access_token } = req.cookies;
    const token: string = access_token as string;
    const claim = await this.authService.verifyAccessToken(token);
    if (!claim) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
    const movies: MovieResponseDto[] =
      await this.moviesService.findAllMoviesByUserId(claim.sub);
    return movies;
  }

  @Get(':id')
  @Roles(Role.User, Role.Admin, Role.Creator)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const { access_token } = req.cookies;
    const token: string = access_token as string;
    const claim = await this.authService.verifyAccessToken(token);
    if (!claim) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
    const userId = claim.sub;
    const history = await this.moviesService.addWatchMovieHistory(userId, id);
    if (!history) {
      throw new InternalServerErrorException('Add history failed');
    }
    return await this.moviesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Creator, Role.Admin)
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @Roles(Role.Creator, Role.Admin)
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
