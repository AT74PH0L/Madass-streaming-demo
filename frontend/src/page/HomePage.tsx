import Card from "../components/Card";
import Navbar from "@/components/Navbar";
import NewMoive from "@/components/NewMoive";
import { useEffect, useState } from "react";
import "./HomePage.css";

export default function HomePage() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // สมมุติข้อมูล mock ที่ได้มาจาก API
    const fetchedImages = [
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
      "https://i.pinimg.com/originals/07/48/88/074888f68348811a30b7cc12ae77ee50.png",
    ];

    setImages(fetchedImages); // เพิ่ม URL รูปภาพลงใน state
  }, []);

  return (
    <>
      <Navbar />
      <NewMoive />
      <div className="header">
        <h1>All movie</h1>
      </div>
      <div className="card-list">
        {images.map((img, index) => (
          <Card key={index} img={img} />
        ))}
      </div>
    </>
  );
}
