import Button from "./ui/button2";
import "./NewMovie.css";
import Radio from "./ui/radio";
function NewMoive() {
  return (
    <div className="newMovie">
      <div className="left">
        <div className="title">
          <div className="movieName"> Movie name </div>
          <div>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas
            vel architecto similique provident adipisci, ullam atque consequatur
            eveniet exercitationem aspernatur qui! Cupiditate, placeat!
          </div>
          <div className="review">
            <Radio/>
          </div>
        </div>

        <div className="btn-play">
          <Button text="Play" />
          {/* <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi nesciunt nemo mollitia minus excepturi nulla voluptatum eaque, delectus placeat quis iure temporibus, ad deserunt quisquam numquam impedit veritatis reiciendis optio?</div> */}
        </div>
      </div>
      <div className="right">
        {/* <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque, accusamus. Fuga quidem, inventore, quo, molestiae voluptates sint quis laborum repudiandae omnis tempore et?</div> */}
        <img className="imgNew"
          src="https://4kwallpapers.com/images/wallpapers/peaky-blinders-3840x2160-14932.jpg"
          alt=""
        />
      </div>
    </div>
  );
}

export default NewMoive;
