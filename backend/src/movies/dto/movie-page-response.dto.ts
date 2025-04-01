import { MovieResponseDto } from './movie-response.dto';

export class MoviesPage {
  totalMovies: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  movies: MovieResponseDto[];
}
