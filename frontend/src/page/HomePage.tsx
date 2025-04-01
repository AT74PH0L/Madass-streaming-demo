import Card from "../components/Card";
import NewMoive from "@/components/NewMoive";
import { useEffect, useState, useRef, useCallback } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import axiosInstant from "@/utils/axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [allMovie, setAllMovie] = useState<
    {
      id: string;
      name: string;
      pathImg: string;
      description: string;
    }[]
  >([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch movies with pagination
  const fetchMovies = useCallback(async () => {
    try {
      const response = await axiosInstant.get(`/movies?page=${page}`);
      console.log(response);
      console.log("Loading more movies...");
      setAllMovie((prev) => [...prev, ...response.data.movies]);
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setHasMore(false);
      navigate("/");
    }
  }, [page, navigate]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

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

  return (
    <>
      <div>
        <NewMoive />
      </div>
      <div>
        <div className="header ml-10">
          <h1>All Movies</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-8 max-w-6xl mx-auto mt-10">
          {allMovie.map((movie, index) => {
            if (index === allMovie.length - 1) {
              return (
                <div key={movie.id} ref={lastMovieRef}>
                  <Card img={movie.pathImg} id={movie.id} />
                </div>
              );
            }
            return <Card key={movie.id} img={movie.pathImg} id={movie.id} />;
          })}
        </div>
      </div>
    </>
  );
}
