import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstant from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { CirclePlayIcon } from "lucide-react";

interface Movie {
  id: string;
  name: string;
  description: string;
  pathImg: string;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // ดึงค่า id จาก URL
  const [movie, setMovie] = useState<Movie | null>(null);
  const API_URL = import.meta.env.VITE_PUBLIC_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axiosInstant.get(`${API_URL}/movies/${id}`);
        setMovie(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    if (id) fetchMovie();
  }, [id, API_URL]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-2/3 mx-auto grid gap-2">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-5xl font-bold mb-4">{movie.name}</h1>
        <p>{movie.description}</p>
      </div>
      <div className="aspect-video rounded-lg mb-8 flex items-center justify-center relative">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${movie.pathImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <p className="relative z-10">
          <CirclePlayIcon className="logo w-16 h-16 cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200" />
        </p>
      </div>

      <Button onClick={() => navigate(`/review/${id}`)} className="cursor-pointer">Review</Button>
    </div>
  );
};

export default MovieDetail;
