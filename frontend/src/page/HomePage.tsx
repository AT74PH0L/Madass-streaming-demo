import Card from "../components/Card";
import Navbar from "@/components/Navbar";
import NewMoive from "@/components/NewMoive";
import { useEffect, useState } from "react";
import "./HomePage.css";
import { authenApi } from "@/api/authen";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
// import { AxiosError } from "axios";
// import { useNavigate } from "react-router-dom";
export default function HomePage() {
  // const [role, setRole] = useState<string>();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    const fetchedImages = [
      "https://www.thebangkokinsight.com/wp-content/uploads/2019/10/batch_1-88.jpg",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
    ];
    setImages(fetchedImages);
    const authenticateUser = async () => {
      try {
        const response = await authenApi();
        console.log("aaaa", response);
        if (response instanceof AxiosError) {
          navigate("/");
        }
        toast.success("Welcome to MADASS");
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/");
      }
    };

    authenticateUser();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div>
        <NewMoive />
      </div>
      <div>
        <div className="header">
          <h1>All movie</h1>
        </div>
        <div className="card-list">
          {images.map((img, index) => (
            <Card key={index} img={img} />
          ))}
        </div>
      </div>
    </>
  );
}
