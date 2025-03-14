import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstant from "@/utils/axios";

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

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axiosInstant.get(`${API_URL}/movies/${id}`);
        setMovie(response.data);
        console.log(response)
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
    <div style={{ padding: "20px" }}>
      <h1>{movie.name}</h1>
      <img
        src={movie.pathImg}
        alt={movie.description}
        style={{ width: "300px" }}
      />
      <p>{movie.description}</p>
    </div>
  );
};

export default MovieDetail;
