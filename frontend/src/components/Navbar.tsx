import Avatar from "./Avatar/Avatar";
import "./Navbar.css";
// import { useState } from "react";
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-1 shadow-md bg-black">
      {/* Logo */}
      <div className="logo">
        {/* <img
          src="https://fontmeme.com/temporary/313d6110675a2f778d3eb84ed09d5e4c.png"
          alt=""
        /> */}
        MADASS
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <div className="relative w-full m-3 mr-5">
          <input className="input" placeholder="search..." />
        </div>

        {/* Avatar */}
        <Avatar />
      </div>
    </nav>
  );
};

export default Navbar;
