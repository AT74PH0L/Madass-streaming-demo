import React from "react";
import "./button.css";
interface btnProp {
  text: string;
}
const Button: React.FC<btnProp> = ({ text }) => {
  return <button className="button" data-text="Awesome">
        <span className="actual-text">&nbsp;{text}&nbsp;</span>
        <span aria-hidden="true" className="hover-text">
            &nbsp;{text}&nbsp;
        </span>
    </button>;
};

export default Button;
