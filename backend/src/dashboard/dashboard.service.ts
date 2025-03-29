import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { History } from '../movies/entities/history.entity';
import { col, fn, Op, Sequelize } from 'sequelize';
import { Most } from './dto/most.dto';
import { Review } from '../reviews/entities/review.entity';
import { Period } from './dto/period.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(Movie) private readonly movieRepository: typeof Movie,
    @InjectModel(History) private readonly historyRepository: typeof History,
    @InjectModel(Review) private readonly reviewRepository: typeof Review,
  ) {}

  async countTotal() {
    const totalUser = await this.userRepository.count();
    const totalMovie = await this.movieRepository.count();

    return {
      totalUser: totalUser,
      totalMovie: totalMovie,
    };
  }

  async getRecentAddMovies() {
    const movies = await this.movieRepository.findAll({
      order: [['createdAt', 'DESC']],
      limit: 4,
    });
    return movies.map((movie) => ({
      id: movie.id,
      name: movie.name,
      pathImg: movie.pathImg,
      createdAt: movie.createdAt as string,
    }));
  }

  async getMostWatched() {
    const totalWatched = await this.historyRepository.count();
    const histories = await this.historyRepository.findAll({
      attributes: [
        'movieId',
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'count'],
      ],
      include: [{ model: Movie, attributes: ['name'] }],
      group: ['movieId'],
      order: [[Sequelize.literal('count'), 'DESC']],
      limit: 5,
    });
    return histories.map((item) => ({
      id: item.movieId,
      name: item.movie.name,
      percentage:
        totalWatched > 0
          ? (((item.dataValues as Most).count / totalWatched) * 100).toFixed(2)
          : '0.00',
    }));
  }

  async getMostWatchedUser() {
    const histories = await this.historyRepository.findAll({
      attributes: [
        'userId',
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'count'],
      ],
      include: [{ model: User, attributes: ['displayName'] }],
      group: ['userId'],
      order: [[Sequelize.literal('count'), 'DESC']],
      limit: 1,
    });
    return {
      id: histories[0].userId,
      name: histories[0].user.displayName,
      times: (histories[0].dataValues as Most).count.toString(),
    };
  }

  async getMostReviewedMovie() {
    const reviews = await this.reviewRepository.findAll({
      attributes: [
        'movieId',
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'count'],
      ],
      include: [{ model: Movie, attributes: ['name'] }],
      group: ['movieId'],
      order: [[Sequelize.literal('count'), 'DESC']],
      limit: 1,
    });
    return {
      id: reviews[0].movieId,
      name: reviews[0].movie.name,
      times: (reviews[0].dataValues as Most).count.toString(),
    };
  }

  async countTotalByMovieUserId(userId: string) {
    const totalViews = await this.historyRepository.count({
      include: {
        model: Movie,
        where: { userId: userId },
      },
    });
    const totalReviews = await this.reviewRepository.count({
      include: {
        model: Movie,
        where: { userId: userId },
      },
    });

    return {
      totalViews,
      totalReviews,
    };
  }

  async getMostViewMoviesByMovieUserId(userId: string) {
    const histories = await this.historyRepository.findAll({
      attributes: [
        'movieId',
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'count'],
      ],
      include: {
        model: Movie,
        where: { userId: userId },
      },
      group: ['movieId'],
      order: [[Sequelize.literal('count'), 'DESC']],
      limit: 5,
    });

    return histories.map((item) => ({
      id: item.movieId,
      name: item.movie.name,
      pathImg: item.movie.pathImg,
      times: (item.dataValues as Most).count.toString(),
    }));
  }

  async getViewWithTimeSeries(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const total = await this.historyRepository.count({
      where: {
        timestamp: { [Op.gte]: thirtyDaysAgo },
      },
      include: {
        model: Movie,
        where: { userId: userId },
      },
    });

    const histories = await this.historyRepository.findAll({
      attributes: [
        [fn('DATE', col('timestamp')), 'date'],
        [fn('COUNT', col('*')), 'count'],
      ],
      where: {
        timestamp: { [Op.gte]: thirtyDaysAgo },
      },
      include: {
        model: Movie,
        where: { userId: userId },
        attributes: [],
      },
      group: [fn('DATE', col('timestamp'))],
      order: [[fn('DATE', col('timestamp')), 'ASC']],
    });

    return {
      totalViewsPeriod: total,
      data: histories.map((item) => ({
        date: (item.dataValues as Period).date,
        views: (((item.dataValues as Period).count / total) * 100).toFixed(2),
      })),
    };
  }
}
