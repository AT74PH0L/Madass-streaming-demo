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
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

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
    createMovieDto.userId = claim.sub;
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @Roles(Role.User, Role.Admin, Role.Creator)
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @Roles((Role.User, Role.Admin, Role.Creator))
  async findOne(@Param('id') id: string) {
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
