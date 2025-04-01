export interface UserProfile {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
  role: string;
}

export interface MovieHistory {
  id: string;
  name: string;
  pathImg: string;
  timestamp: string;
}

export interface DashboardProfile {
  total: { viewTimes: number; moviesWatched: number };
  watchHistory: MovieHistory[];
  mostWatchedMovie: {
    id: string;
    name: string;
    times: string;
  };
}
