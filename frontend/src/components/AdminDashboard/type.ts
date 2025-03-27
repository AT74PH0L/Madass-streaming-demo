interface Total {
  totalUser: number;
  totalMovie: number;
}

interface RecentMovies {
  id: string;
  name: string;
  pathImg: string;
  description: string;
  createdAt: string;
}

interface MostWatched {
  id: string;
  name: string;
  percentage: string;
}

interface MostWatchedUser {
  id: string;
  name: string;
  times: string;
}

interface mostReviewedMovie {
  id: string;
  name: string;
  times: string;
}
export interface Dashboard {
  total: Total;
  recentMovies: RecentMovies[];
  mostWatched: MostWatched[];
  mostWatchedUser: MostWatchedUser;
  mostReviewedMovie: mostReviewedMovie;
}
