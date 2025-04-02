import { useEffect, useState } from "react";
import { StatCard } from "@/components/AdminDashboard/stat-card";
import type { DashboardProfile, UserProfile } from "@/components/Profile/type";
import { WatchHistory } from "@/components/Profile/WatchHistory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/utils/axios";
import { Clock, Film, Heart, Pencil, User } from "lucide-react";
import NotificationToast from "@/components/ui/NotificationToast";
import { toast } from "react-toastify";
import DOMPurify from "dompurify"; // Import DOMPurify
import { AxiosError } from "axios";

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

  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user.displayName);
  const [newPicture, setNewPicture] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user.picture);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sanitizeInput = (input: string) => {
    return DOMPurify.sanitize(input);
  };

  const handleSaveDisplayName = async () => {
    const sanitizedDisplayName = sanitizeInput(newDisplayName);
    try {
      const response = await axiosInstance.patch("/users", {
        displayName: sanitizedDisplayName,
      });
      if (response.data) {
        setUser((prevUser) => ({
          ...prevUser,
          displayName: sanitizedDisplayName,
        }));
        setIsEditing(false);
        toast.success("Update username successfully");
      }
    } catch (error) {
      const err = error as AxiosError;
      const errorMessage =
        (err.response?.data as { message?: string[] })?.message?.[0] ||
        "An unexpected error occurred";
      toast.error(errorMessage);
      console.error("Error updating display name:", error);
    }
  };

  const handleSavePicture = async () => {
    const sanitizedPicture = sanitizeInput(previewUrl);
    try {
      setNewPicture(sanitizedPicture);
      console.log(newPicture);
      const response = await axiosInstance.patch("/users", {
        picture: newPicture,
      });
      if (response instanceof AxiosError) {
        toast.error(response.data.message[0]);
      }
      if (response.data) {
        setUser((prevUser) => ({
          ...prevUser,
          picture: response.data.picture || sanitizedPicture,
        }));
        setIsEditing(false);
        toast.success("Update profile successfully");
      }
    } catch (error) {
      toast.error("Error updating profile picture");
      console.error("Error updating profile picture:", error);
    }
  };

  useEffect(() => {
    setNewDisplayName(user.displayName);
    setPreviewUrl(user.picture);
  }, [user.displayName, user.picture]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/profile");
        if (response) {
          const { data } = response;
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching authentication:", error);
      }
    };
    const fetchDashboard = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/profile");
        if (response) {
          const { data } = response;
          setDashboard(data);
        }
      } catch (error) {
        console.error("Error fetching authentication:", error);
      }
    };

    fetchDashboard();
    fetchProfile();
  }, []);

  return (
    <>
      <div className="w-2/3 mx-auto grid gap-2">
        <div className="bg-gradient-to-b pt-6 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-primary flex items-center justify-center">
                  <AvatarImage src={user.picture} alt={user.displayName} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-black">
                        Change profile
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="mx-auto w-32 h-32 relative">
                        <Avatar className="h-32 w-32 border-2 border-primary">
                          <AvatarImage
                            src={previewUrl}
                            alt={user.displayName}
                          />
                          <AvatarFallback>
                            <User className="h-16 w-16" />
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="text">upload</Label>
                        <Input
                          value={previewUrl}
                          onChange={(e) => setPreviewUrl(e.target.value)}
                          className="text-black"
                          placeholder="Image URL"
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button onClick={handleSavePicture}>save</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="text-center md:text-left space-y-2">
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <Input
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      className="text-2xl font-bold h-auto py-1"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold">{user.displayName}</h1>
                  )}

                  {isEditing ? (
                    <Button size="sm" onClick={handleSaveDisplayName}>
                      save
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>

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
      <NotificationToast />
    </>
  );
}
