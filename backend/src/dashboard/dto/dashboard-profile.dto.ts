export class DashboardProfile {
  total: { viewTimes: number; moviesWatched: number };
  watchHistory: {
    id: string;
    name: string;
    pathImg: string;
    timestamp: string;
  }[];
  mostWatchedMovie: {
    id: string;
    name: string;
    times: string;
  };
}
