import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from './entities/movie.entity';
import { History } from './entities/history.entity';
import { Sequelize } from 'sequelize-typescript';
import { Review } from 'src/reviews/entities/review.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie) private readonly moviesRepository: typeof Movie,
    @InjectModel(History) private readonly historyRepository: typeof History,
  ) {}
  async create(userId: string, createMovieDto: CreateMovieDto) {
    return await this.moviesRepository.create({
      name: createMovieDto.name,
      description: createMovieDto.description,
      pathImg: createMovieDto.pathImg,
      userId: userId,
    });
  }

  async findAll() {
    return await this.moviesRepository.findAll({ order: [['name', 'ASC']] });
  }

  async findOne(id: string) {
    return await this.moviesRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.moviesRepository.findOne({ where: { id: id } });
    if (movie) {
      return movie.update(updateMovieDto);
    }
    return null;
  }

  async remove(id: string) {
    const movie = await this.moviesRepository.findOne({
      where: { id: id },
      include: [Review, History],
    });
    if (movie) {
      return movie.destroy();
    }
  }

  async findAllMoviesByUserId(id: string) {
    const movies = await this.moviesRepository.findAll({
      where: { userId: id },
      order: [['name', 'ASC']],
    });
    return movies.map((movie) => ({
      id: movie.id,
      name: movie.name,
      pathImg: movie.pathImg,
      description: movie.description,
      createAt: movie.createdAt as string,
    }));
  }

  async addWatchMovieHistory(userId: string, movieId: string) {
    return await this.historyRepository.create({
      timestamp: Sequelize.literal('CURRENT_TIME'),
      userId: userId,
      movieId: movieId,
    });
  }
}
