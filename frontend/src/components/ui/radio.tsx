import "./radio.css";

const Radio = () => {
  const flag = true;
  return (
    <div className="rating">
      <input value="5" name="rate" id="star5" type="radio" />
      <label title="text" htmlFor="star5"></label>
      <input value="4" name="rate" id="star4" type="radio" checked={flag} />
      <label title="text" htmlFor="star4"></label>
      <input value="3" name="rate" id="star3" type="radio" />
      <label title="text" htmlFor="star3"></label>
      <input value="2" name="rate" id="star2" type="radio" />
      <label title="text" htmlFor="star2"></label>
      <input value="1" name="rate" id="star1" type="radio" />
      <label title="text" htmlFor="star1"></label>
    </div>
  );
};

export default Radio;
