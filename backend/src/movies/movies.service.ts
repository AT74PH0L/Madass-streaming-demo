import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from './entities/movie.entity';
import { History } from './entities/history.entity';
import { Sequelize } from 'sequelize-typescript';
import { Review } from '../reviews/entities/review.entity';
import { Op } from 'sequelize';

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
      order: [['createdAt', 'DESC']],
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

  async findAllWithPage(page: string) {
    const pageSize = 5; // Number of movies per page
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1); // Ensure page is at least 1
    const offset = (pageNumber - 1) * pageSize;

    // Fetch movies with pagination
    const { count, rows: movies } = await this.moviesRepository.findAndCountAll(
      {
        limit: pageSize,
        offset: offset,
        order: [['createdAt', 'DESC']],
      },
    );

    const totalPages = Math.ceil(count / pageSize);
    const hasMore = pageNumber < totalPages;

    return {
      totalMovies: count,
      totalPages: totalPages,
      currentPage: pageNumber,
      hasMore: hasMore,
      movies: movies,
    };
  }

  async findAllMoviesByUserIdWithPage(userId: string, page: string) {
    const pageSize = 5;
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const offset = (pageNumber - 1) * pageSize;

    const { count, rows: movies } = await this.moviesRepository.findAndCountAll(
      {
        where: { userId: userId },
        limit: pageSize,
        offset: offset,
        order: [['createdAt', 'DESC']],
      },
    );

    const totalPages = Math.ceil(count / pageSize);
    const hasMore = pageNumber < totalPages;

    return {
      totalMovies: count,
      totalPages: totalPages,
      currentPage: pageNumber,
      hasMore: hasMore,
      movies: movies,
    };
  }

  async searchByQuery(query: string) {
    const movies = await this.moviesRepository.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    return movies.map((movie) => ({
      id: movie.id,
      name: movie.name,
      pathImg: movie.pathImg,
      description: movie.description,
      createAt: movie.createdAt as string,
    }));
  }
}
