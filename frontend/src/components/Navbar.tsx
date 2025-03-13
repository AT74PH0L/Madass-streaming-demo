import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import "./Navbar.css";
import { useState } from "react";

export default function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const handleLogout = () => {
    // Your logout logic goes here (e.g., clearing tokens or redirecting)
    console.log("Logging out...");
  };

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
        <div className="mr-5 cursor-pointer" onClick={toggleDropdown}>
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>AT</AvatarFallback>
          </Avatar>
        </div>
        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
            <ul>
              <li>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
