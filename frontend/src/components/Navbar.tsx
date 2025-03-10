import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-1 shadow-md bg-black">
      {/* Logo */}
      <div className="">
        {/* <img
          src="https://fontmeme.com/temporary/313d6110675a2f778d3eb84ed09d5e4c.png"
          alt=""
        /> */}
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <div className="relative w-full m-3 mr-5">
          <input className="input" placeholder="search..." />
        </div>

        {/* Avatar */}
        <div className="mr-5">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>AT</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
}
