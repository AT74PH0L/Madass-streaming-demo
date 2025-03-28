interface Total {
  totalViews: number;
  totalReviews: number;
}

interface MostViewMovies {
  id: string;
  name: string;
  pathImg: string;
  times: string;
}

interface ViewWithTimeSeries {
  totalViewsPeriod: number;
  data: {
    date: string;
    views: string;
  }[];
}

export interface Dashboard {
  total: Total;
  viewWithTimeSeries: ViewWithTimeSeries;
  mostViewMovies: MostViewMovies[];
}
