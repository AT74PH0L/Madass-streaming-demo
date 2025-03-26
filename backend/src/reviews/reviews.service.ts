import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ReviewResponse } from './dto/review-response.dto';
import { Movie } from 'src/movies/entities/movie.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private readonly reviewsRepository: typeof Review,
    @InjectModel(Movie) private readonly moviesRepository: typeof Movie,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const review = await this.reviewsRepository.create({
      content: createReviewDto.content,
      movieId: createReviewDto.movieId,
      userId: userId,
    });
    return await this.reviewsRepository.findOne({
      where: { id: review.id },
      include: {
        model: User,
        attributes: ['displayName', 'picture'],
      },
    });
  }

  async findAll() {
    return await this.reviewsRepository.findAll();
  }

  async findOne(id: string) {
    return await this.reviewsRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewsRepository.findOne({ where: { id: id } });
    if (review) {
      return review.update({ content: updateReviewDto.content });
    }
    return null;
  }

  async remove(id: string) {
    const review = await this.reviewsRepository.findOne({ where: { id: id } });
    if (review) {
      return review.destroy();
    }
  }

  async findReviewsByMovieId(movieId: string): Promise<ReviewResponse[]> {
    const reviews = await this.reviewsRepository.findAll({
      where: { movieId: movieId },
      include: {
        model: User,
        attributes: ['displayName', 'picture'],
      },
      order: [['createdAt', 'DESC']],
    });
    return reviews.map((review) => ({
      id: review.id,
      content: review.content,
      createdAt: review.createdAt as string,
      userId: review.userId,
      displayName: review.user.displayName,
      picture: review.user.picture,
    }));
  }

  async findMovieById(movieId: string) {
    return await this.moviesRepository.findOne({ where: { id: movieId } });
  }
}
