import { useEffect, useState, useRef, useCallback } from "react";
import { LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieCard } from "./MovieCard";
import { EditMovieDialog } from "./EditMovieDialog";
import { DeleteMovieDialog } from "./DeleteMovieDialog";
import type { Movie } from "./type/movie";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function StudioPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  // Fetch movies with pagination
  const fetchMovies = useCallback(async () => {
    if (!hasMore) return;

    try {
      const response = await axiosInstance.get(`/movies/creator?page=${page}`);
      if (response.data) {
        setMovies((prev) => [...prev, ...response.data.movies]);
        setHasMore(response.data.hasMore); // Ensure the backend returns `hasMore`
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setHasMore(false);
    }
  }, [page, hasMore]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Observer for infinite scroll
  const lastMovieRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !hasMore) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      observer.current.observe(node);
    },
    [hasMore]
  );

  const handleEdit = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsCreating(false);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedMovie(null);
    setIsCreating(true);
    setIsEditDialogOpen(true);
  };

  const handleSaveMovie = () => {
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/movies/${selectedMovie?.id}`);
      toast.success("Movie deleted successfully");
      setMovies(movies.filter((movie) => movie.id !== selectedMovie?.id));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete movie");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 ml-10 mr-10">
        <h1 className="text-3xl font-bold">Movie Studio</h1>
        <div className="flex gap-4">
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Movie
          </Button>
          <Button onClick={() => navigate("/studio/dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center text-3xl font-bold text-orange-300">
        {movies.length === 0 ? <div>No movies available</div> : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {movies.map((movie, index) => {
          if (index === movies.length - 1) {
            return (
              <div key={movie.id} ref={lastMovieRef}>
                <MovieCard
                  movie={movie}
                  onEdit={() => handleEdit(movie)}
                  onDelete={() => handleDelete(movie)}
                />
              </div>
            );
          }
          return (
            <MovieCard
              key={movie.id}
              movie={movie}
              onEdit={() => handleEdit(movie)}
              onDelete={() => handleDelete(movie)}
            />
          );
        })}
      </div>

      {hasMore && <p className="text-center mt-4">Loading more movies...</p>}

      <EditMovieDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        movie={selectedMovie}
        isCreating={isCreating}
        onSave={handleSaveMovie}
      />

      <DeleteMovieDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        movieTitle={selectedMovie?.name || ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
