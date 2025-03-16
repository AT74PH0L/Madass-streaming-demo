import Card from "../components/Card";
import NewMoive from "@/components/NewMoive";
import { useEffect, useState } from "react";
import "./HomePage.css";
// import { authenApi } from "@/api/authen";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstant from "@/utils/axios";
// import { AxiosError } from "axios";

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
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // เพิ่ม state สำหรับตรวจสอบการ login

  // ฟังก์ชันดึงข้อมูลหนังทั้งหมด
  const fetchMovies = async () => {
    try {
      const response = await axiosInstant.get("/movies");
      console.log("Load img")
      setAllMovie(response.data);
      toast.success("Welcome to MADASS");
    } catch (error) {
      navigate("/");
      console.error("Error fetching movies:", error);
    }
  };

  // ฟังก์ชันตรวจสอบการ Authentication
  // const authenticateUser = async () => {
  //   try {
  //     const response = await authenApi();
  //     console.log("Authentication Response:", response);
  //     setIsAuthenticated(true); // หากการตรวจสอบผ่าน, set เป็น true
  //   } catch (error) {
  //     console.error("Error during authentication:", error);
  //     setIsAuthenticated(false); // หากเกิดข้อผิดพลาด, set เป็น false
  //     navigate("/"); // ส่งผู้ใช้กลับไปหน้าแรก
  //   }
  // };

  useEffect(() => {
    // ตรวจสอบสถานะการ Authentication ก่อนดึงข้อมูลหนัง
    // if (isAuthenticated === null) {
    //   // หากยังไม่ได้ตรวจสอบสถานะการล็อกอิน, เรียกใช้ authenticateUser
    //   authenticateUser();
    // } else if (isAuthenticated) {
    //   // หากผู้ใช้ล็อกอินแล้ว, ดึงข้อมูลหนัง
    fetchMovies();
    // }
  }, [navigate]); // เพิ่ม isAuthenticated เป็น dependency ของ useEffect

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
          {allMovie.map((movie) => (
            <Card key={movie.id} img={movie.pathImg} id={movie.id} />
          ))}
        </div>
      </div>
    </>
  );
}
