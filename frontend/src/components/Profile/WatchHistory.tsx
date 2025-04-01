import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import { MovieHistory } from "./type";
import { useNavigate } from "react-router-dom";

interface WatchHistoryProps {
  watchHistory: MovieHistory[];
}

export function WatchHistory({ watchHistory }: WatchHistoryProps) {
  const groupMoviesByDate = (movies: MovieHistory[]) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    const groups = {
      today: [] as MovieHistory[],
      yesterday: [] as MovieHistory[],
      thisWeek: [] as MovieHistory[],
      earlier: [] as MovieHistory[],
    };

    movies.forEach((movie) => {
      const movieDate = new Date(movie.timestamp).toDateString();
      const daysDiff = Math.floor(
        (Date.now() - new Date(movie.timestamp).getTime()) / (1000 * 3600 * 24)
      );

      if (movieDate === today) {
        groups.today.push(movie);
      } else if (movieDate === yesterday) {
        groups.yesterday.push(movie);
      } else if (daysDiff < 7) {
        groups.thisWeek.push(movie);
      } else {
        groups.earlier.push(movie);
      }
    });

    return groups;
  };

  const { today, yesterday, thisWeek, earlier } =
    groupMoviesByDate(watchHistory);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold mb-4">Watch History</h2>

      {today.length > 0 && (
        <HistorySection
          title="Today"
          icon={<Clock className="h-5 w-5" />}
          movies={today}
        />
      )}

      {yesterday.length > 0 && (
        <HistorySection
          title="Yesterday"
          icon={<Calendar className="h-5 w-5" />}
          movies={yesterday}
        />
      )}

      {thisWeek.length > 0 && (
        <HistorySection
          title="This Week"
          icon={<Calendar className="h-5 w-5" />}
          movies={thisWeek}
        />
      )}

      {earlier.length > 0 && (
        <HistorySection
          title="Earlier"
          icon={<Calendar className="h-5 w-5" />}
          movies={earlier}
        />
      )}
    </div>
  );
}

interface HistorySectionProps {
  title: string;
  icon: React.ReactNode;
  movies: MovieHistory[];
}

function HistorySection({ title, icon, movies }: HistorySectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="space-y-4">
        {movies.map((movie) => (
          <WatchHistoryItem key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

interface WatchHistoryItemProps {
  movie: MovieHistory;
}

function WatchHistoryItem({ movie }: WatchHistoryItemProps) {
  const navigate = useNavigate();
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/4 md:w-1/5 lg:w-1/6">
            <div className="relative aspect-[2/3] w-full">
              <img
                src={movie.pathImg}
                alt={movie.name}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{movie.name}</h3>
                <span className="text-sm text-gray-400">
                  {formatTime(movie.timestamp)}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-400">
                <span>
                  Watched on {new Date(movie.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <button
                className="text-sm text-primary hover:underline"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                Watch Again
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
