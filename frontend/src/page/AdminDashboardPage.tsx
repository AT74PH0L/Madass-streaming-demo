import { authenApi } from "@/api/authen";
import { StatCard } from "@/components/AdminDashboard/stat-card";
import { Dashboard } from "@/components/AdminDashboard/type";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import axiosInstance from "@/utils/axios";
import { AxiosResponse } from "axios";
import { Film, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<Dashboard>({
    total: { totalUser: 0, totalMovie: 0 },
    recentMovies: [],
    mostWatched: [],
    mostWatchedUser: {
      id: "",
      name: "",
      times: "",
    },
    mostReviewedMovie: {
      id: "",
      name: "",
      times: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenApi();
        if (response.role != "admin") {
          navigate("/home");
        }
      } catch (error) {
        console.error("Error fetching authentication:", error);
        navigate("/home");
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchDashbaord = async () => {
      try {
        const response: AxiosResponse = await axiosInstance.get(
          "/dashboard/all"
        );
        if (response) {
          const { data } = response;
          console.log(data);
          setDashboard(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashbaord();
  }, []);
  return (
    <>
      <div className="flex justify-between items-center mb-8 ml-10 mr-10">
        <h1
          className="text-3xl font-bold cursor-pointer"
          onClick={() => navigate("/admin")}
        >
          Back office
        </h1>
      </div>
      <div className="w-2/3 mx-auto grid gap-2">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Users"
            value={dashboard?.total.totalUser.toString()}
            change=""
            icon={Users}
          />
          <StatCard
            title="Total Movies"
            value={dashboard?.total.totalMovie.toString()}
            change=""
            icon={Film}
          />
          <StatCard
            title="Most Watched User"
            value={dashboard?.mostWatchedUser.name}
            change={dashboard?.mostWatchedUser.times}
            icon={Users}
          />
          <StatCard
            title="Most Reviewed Movie"
            value={dashboard?.mostReviewedMovie.name}
            change={dashboard?.mostReviewedMovie.times}
            icon={Film}
          />
        </div>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-8">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Movies</CardTitle>
              <CardDescription>
                Recently added movies to the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard?.recentMovies.map((movie) => (
                  <div key={movie.id} className="flex items-center gap-4">
                    <div className="relative aspect-video w-24 overflow-hidden rounded-md">
                      <img
                        src={movie.pathImg || "/placeholder.svg"}
                        alt={movie.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="grid gap-1">
                      <div className="font-semibold">{movie.name}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{movie.createdAt}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Popular Movies</CardTitle>
              <CardDescription>Most watched movie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.mostWatched.map((movie) => (
                  <div key={movie.id} className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{movie.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {movie.percentage}%
                      </div>
                    </div>
                    <Progress value={Number(movie.percentage)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
