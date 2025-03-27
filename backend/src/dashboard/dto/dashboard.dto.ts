export interface Dashboard {
  total: {
    totalUser: number;
    totalMovie: number;
  };
  recentMovies: {
    id: string;
    name: string;
    pathImg: string;
    createdAt: string;
  }[];
  mostWatched: {
    id: string;
    name: string;
    percentage: string;
  }[];
  mostWatchedUser: {
    id: string;
    name: string;
    times: string;
  };
  mostReviewedMovie: {
    id: string;
    name: string;
    times: string;
  };
}
