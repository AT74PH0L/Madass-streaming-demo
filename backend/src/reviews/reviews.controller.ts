import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';

@Controller('reviews')
@UseGuards(AuthGuard, RolesGuard)
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @Roles(Role.User, Role.Admin, Role.Creator)
  async create(@Req() req: Request, @Body() createReviewDto: CreateReviewDto) {
    const { access_token } = req.cookies;
    const token: string = access_token as string;
    const claim = await this.authService.verifyAccessToken(token);
    if (!claim) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
    const userId = claim.sub;

    const movie = await this.reviewsService.findMovieById(
      createReviewDto.movieId,
    );
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const review = await this.reviewsService.create(userId, createReviewDto);
    if (!review) {
      throw new InternalServerErrorException('Server error');
    }
    return {
      id: review.id,
      content: review.content,
      createdAt: review.createdAt as string,
      userId: review.userId,
      displayName: review.user.displayName,
      picture: review.user.picture,
    };
  }

  @Get()
  @Roles(Role.User, Role.Admin, Role.Creator)
  async findAll(@Query('movieId') movieId: string) {
    if (movieId) {
      const movie = await this.reviewsService.findMovieById(movieId);
      if (!movie) {
        throw new NotFoundException('Movie not found');
      }
      return this.reviewsService.findReviewsByMovieId(movieId);
    }
    return this.reviewsService.findAll();
  }

  @Get(':id')
  @Roles(Role.User, Role.Admin, Role.Creator)
  async findOne(@Param('id') id: string) {
    const review = await this.reviewsService.findOne(id);
    if (!review) {
      throw new NotFoundException('Review not found.');
    }
    return review;
  }

  @Patch(':id')
  @Roles(Role.User, Role.Admin, Role.Creator)
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const review = await this.reviewsService.findOne(id);
    if (!review) {
      throw new NotFoundException('Review not found.');
    }
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @Roles(Role.User, Role.Admin, Role.Creator)
  async remove(@Param('id') id: string) {
    const review = await this.reviewsService.findOne(id);
    if (!review) {
      throw new NotFoundException('Review not found.');
    }
    return this.reviewsService.remove(id);
  }
}
