import React from "react";
import "./card.css";

interface ImgProp {
  img: string; // กำหนด prop img ที่เป็น string
}

const Card: React.FC<ImgProp> = ({ img }) => {
  return (
    <div className="container">
      <div className="box">
        <img className="card-image" src={img} alt="Car" />
      </div>
    </div>
  );
};

export default Card;
