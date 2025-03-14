import Card from "../components/Card";
import Navbar from "@/components/Navbar";
import NewMoive from "@/components/NewMoive";
import { useEffect, useState } from "react";
import "./HomePage.css";
import { authenApi } from "@/api/authen";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import axios, { AxiosError } from "axios";
import axiosInstant from "@/utils/axios";
import { AxiosError } from "axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [images, setImages] = useState<
    { id: string; name: string; pathImg: string; description: string }[]
  >([]);
  const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลหนังทั้งหมด
    const fetchMovies = async () => {
      try {
        const response = await axiosInstant.get("/movies");
        console.log(response.data.imgPath);
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    // ฟังก์ชันตรวจสอบการ Authentication
    const authenticateUser = async () => {
      try {
        const response = await authenApi();
        console.log("Authentication Response:", response);
        toast.success("Welcome to MADASS");
        if (response instanceof AxiosError) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        navigate("/");
      }
    };

    authenticateUser();
    fetchMovies();
  }, [navigate, API_URL]); // ไม่มี images ในนี้

  return (
    <>
      <Navbar />
      <div>
        <NewMoive />
      </div>
      <div>
        <div className="header">
          <h1>All Movies</h1>
        </div>
        <div className="card-list">
          {images.map((movie) => (
            <Card
              key={movie.id}
              img={movie.pathImg}
              id={movie.id}
            />
          ))}
        </div>
      </div>
    </>
  );
}
