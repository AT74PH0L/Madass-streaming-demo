import React from "react";
import { useNavigate } from "react-router-dom";
import "./card.css";

interface ImgProp {
  img: string;
  id: string;
}

const Card: React.FC<ImgProp> = ({ img, id }) => {
  const navigate = useNavigate();

  const onClickCard = () => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="container">
      <div className="box">
        <img
          className="card-image"
          src={img}
          alt="Movie"
          onClick={onClickCard}
        />
      </div>
    </div>
  );
};

export default Card;
