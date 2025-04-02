import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Avatar from "./Avatar/Avatar";
import "./Navbar.css";
import axiosInstance from "@/utils/axios";

interface MovieQueryProb {
  id: string;
  name: string;
  pathImg: string;
  description: string;
  createAt: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MovieQueryProb[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Search API function
  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/movies/search?query=${encodeURIComponent(query)}`
      );
      if (!response) {
        throw new Error("Search request failed");
      }

      const { data } = response;
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching movies:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchMovies(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
    } else {
      setShowResults(true);
    }
  };

  const handleResultClick = (id: string) => {
    // Navigate to movie details page
    navigate(`/movie/${id}`);
    setShowResults(false);
    setSearchTerm("");
  };

  return (
    <nav className="flex items-center justify-between p-1 shadow-md bg-black">
      {/* Logo */}
      <div
        className="logo cursor-pointer text-white text-xl font-bold"
        onClick={() => navigate("/home")}
      >
        MADASS
      </div>

      {/* Search Bar with Results */}
      <div className="flex justify-between items-center relative">
        <div className="relative w-full m-3 mr-5">
          <input
            className="input p-2 rounded w-full"
            placeholder="search..."
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => searchTerm && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />

          {/* Search Results */}
          {showResults && (
            <div className="absolute left-0 right-0 bg-white mt-1 rounded shadow-lg z-10 max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleResultClick(result.id)}
                  >
                    <img
                      src={result.pathImg}
                      alt={result.name}
                      className="w-12 h-16 object-cover mr-3"
                      onError={(e) => {
                        // Fallback for broken images
                        (e.target as HTMLImageElement).src =
                          "/images/placeholder.jpg";
                      }}
                    />
                    <div className="text-black">{result.name}</div>
                  </div>
                ))
              ) : searchTerm ? (
                <div className="p-4 text-center text-gray-500">
                  No results found
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Avatar */}
        <Avatar />
      </div>
    </nav>
  );
};

export default Navbar;
