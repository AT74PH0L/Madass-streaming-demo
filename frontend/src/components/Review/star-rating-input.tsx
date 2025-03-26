import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingInputProps {
  rating: number;
  onChange: (rating: number) => void;
  max?: number;
}

export default function StarRatingInput({
  rating,
  onChange,
  max = 5,
}: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(max)].map((_, i) => {
          const starValue = i + 1;
          return (
            <Star
              key={i}
              className={`w-6 h-6 cursor-pointer transition-colors ${
                (hoverRating || rating) >= starValue
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => onChange(starValue)}
            />
          );
        })}
      </div>
      {(rating > 0 || hoverRating > 0) && (
        <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {hoverRating || rating}/5
        </span>
      )}
    </div>
  );
}
