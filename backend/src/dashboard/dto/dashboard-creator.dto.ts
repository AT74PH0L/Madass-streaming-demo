interface Total {
  totalViews: number;
  totalReviews: number;
}

interface MostViewMovies {
  id: string;
  name: string;
  times: string;
}

interface ViewWithTimeSeries {
  totalViewsPeriod: number;
  data: {
    date: string;
    views: string;
  }[];
}

export class DashboardCreator {
  total: Total;
  viewWithTimeSeries: ViewWithTimeSeries;
  mostViewMovies: MostViewMovies[];
}
