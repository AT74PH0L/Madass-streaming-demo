import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import Redis from 'ioredis';
import { Movie } from '../movies/entities/movie.entity';
import { Review } from '../reviews/entities/review.entity';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'mysql',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT ?? '3306'),
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        synchronize: true,
        autoLoadModels: true,
      }),
    }),
    SequelizeModule.forFeature([User, Movie, Review]),
  ],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || '',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD || undefined,
        });
      },
    },
  ],
  exports: [SequelizeModule, 'REDIS_CLIENT'],
})
export class DatabaseModule {}
