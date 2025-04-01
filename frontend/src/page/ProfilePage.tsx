import { StatCard } from "@/components/AdminDashboard/stat-card";
import { DashboardProfile, UserProfile } from "@/components/Profile/type";
import { WatchHistory } from "@/components/Profile/WatchHistory";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/utils/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Clock, Film, Heart, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState<UserProfile>({
    id: "",
    displayName: "",
    email: "",
    firstName: "",
    lastName: "",
    picture: "",
    role: "",
  });

  const [dashboard, setDashboard] = useState<DashboardProfile>({
    total: { viewTimes: 0, moviesWatched: 0 },
    watchHistory: [],
    mostWatchedMovie: {
      id: "",
      name: "",
      times: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/profile");
        console.log(response);
        if (response) {
          const { data } = response;
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching authentication:", error);
      }
    };
    const fetchDashbaord = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/profile");
        console.log(response);
        if (response) {
          const { data } = response;
          setDashboard(data);
        }
      } catch (error) {
        console.error("Error fetching authentication:", error);
      }
    };

    fetchDashbaord();
    fetchProfile();
  }, []);

  return (
    <>
      <div className="w-2/3 mx-auto grid gap-2">
        <div className="bg-gradient-to-b pt-6 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary flex items-center justify-center">
                <AvatarImage src={user.picture} alt={user.displayName} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left space-y-2">
                <h1 className="text-3xl font-bold">{user.displayName}</h1>
                <p className="text-gray-400">{user.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="text-white-400 hover:bg-primary-700"
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
          <StatCard
            title="View Times"
            value={dashboard.total.viewTimes.toString()}
            change=""
            icon={Clock}
          />
          <StatCard
            title="Movies Watched"
            value={dashboard?.total.moviesWatched.toString()}
            change=""
            icon={Film}
          />
          <StatCard
            title="Most Watched Movie"
            value={dashboard?.mostWatchedMovie.name}
            change={dashboard?.mostWatchedMovie.times}
            icon={Heart}
          />
        </div>
        <div>
            <WatchHistory watchHistory={dashboard.watchHistory} />
          </div>
        </div>
    </>
  );
}
