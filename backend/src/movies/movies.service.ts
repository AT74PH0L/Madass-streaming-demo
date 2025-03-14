import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie) private readonly moviesRepository: typeof Movie,
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
    return await this.moviesRepository.findAll();
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
    const movie = await this.moviesRepository.findOne({ where: { id: id } });
    if (movie) {
      return movie.destroy();
    }
  }

  async findAllMoviesByUserId(id: string) {
    const movies = await this.moviesRepository.findAll({
      where: { userId: id },
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
