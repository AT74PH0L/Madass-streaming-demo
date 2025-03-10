import Button from "./ui/button";
import "./NewMovie.css";
function NewMoive() {
  return (
    <>
      <div className="flex">
        <div className="flex flex-col w-1/2 p-4 ml-6 top-center relative">
          <div className="text-[5em]">Name</div>
          <div className="text-[1em]">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi
            similique, eos itaque voluptatibus enim molestiae nostrum, harum
            eaque beatae hic porro labore ex consequatur optio sequi, id
            inventore atque recusandae.
          </div>
          <div className="button">
            <Button text="Play" />
          </div>
        </div>

        <div className="w-1/2">
          <img
            className="w-full h-full object-contain"
            src="https://wallpapers.com/images/featured/peaky-blinders-mf0te5aaoy07nn99.jpg"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

export default NewMoive;
