import { authenApi } from "@/api/authen";
import { StatCard } from "@/components/AdminDashboard/stat-card";
import { Dashboard } from "@/components/CreatorDashboard/type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from "@/utils/axios";
import { AxiosResponse } from "axios";
import { Eye, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatorDashboardPage() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<Dashboard>({
    total: { totalReviews: 0, totalViews: 0 },
    mostViewMovies: [],
    viewWithTimeSeries: {
      totalViewsPeriod: 0,
      data: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenApi();
        if (response.role != "creator" && response.role != "admin") {
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
          "/dashboard/creator"
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
          onClick={() => navigate("/studio")}
        >
          {" "}
          Dashboard Studio
        </h1>
      </div>
      <div className="w-2/3 mx-auto grid gap-2">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <StatCard
              icon={Eye}
              title="Total Views"
              value={dashboard.total.totalViews.toString()}
              change=""
            />
            <StatCard
              icon={TrendingUp}
              title="Total Engagement"
              value={dashboard.total.totalReviews.toString()}
              change=""
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    View your channel metrics over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-91 border border-dashed rounded-lg p-4">
                    <div className="h-full flex flex-col">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h4 className="font-medium">Views</h4>
                          <p className="text-2xl font-bold">
                            {dashboard.viewWithTimeSeries.totalViewsPeriod}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            previous 30 days
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-end">
                        <div className="w-full h-[70%] flex items-end gap-1">
                          {dashboard.viewWithTimeSeries.data.map((item) => (
                            <div
                              key={item.date}
                              className="flex-1 rounded-t"
                              style={{
                                height: `${item.views}%`,
                                backgroundColor: "#3b82f6",
                                // opacity: 0.2 + Math.random() * 0.8,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                  <CardDescription>Your most viewed videos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboard.mostViewMovies.map((item, idx) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="font-bold text-muted-foreground">
                          {idx + 1}
                        </div>
                        <div className="relative aspect-video w-20 h-15 overflow-hidden rounded-md">
                          <img
                            className="object-cover"
                            src={item.pathImg}
                            alt={item.name}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">
                            {item.name}
                          </p>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <span>{item.times} views</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
