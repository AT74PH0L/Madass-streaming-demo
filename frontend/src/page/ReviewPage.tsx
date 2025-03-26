import { useEffect, useState } from "react";
import ReviewForm from "../components/Review/ReviewForm";
import { Comments } from "../components/Review/type";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axiosInstance from "@/utils/axios";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";

interface Movie {
  id: string;
  name: string;
  description: string;
  pathImg: string;
}

export default function Review() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [comments, setComments] = useState<Comments[]>([]);
  const addComment = async (commentText: string) => {
    if (!commentText.trim()) return;

    const newComment = {
      content: commentText,
      movieId: id,
    };

    try {
      const response: AxiosResponse = await axiosInstance.post(
        `/reviews`,
        newComment
      );
      console.log(response);
      if (response) {
        const { data } = response;
        setComments([data, ...comments]);
      }
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axiosInstance.get(`/movies/${id}`);
        setMovie(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    const fetchReview = async () => {
      try {
        const response: AxiosResponse = await axiosInstance.get(
          `/reviews?movieId=${id}`
        );
        console.log(response);
        if (response) {
          const { data } = response;
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };
    if (id) {
      fetchMovie();
      fetchReview();
    }
  }, [id]);

  if (!movie) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-2/3 mx-auto">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-5xl font-bold mb-4">{movie.name}</h1>
        <img className="w-120 h-150 object-cover rounded-lg" src={movie.pathImg} alt={movie.description} />
        <p>{movie.description}</p>
      </div>

      <ReviewForm comments={comments} addComment={addComment} />
      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="comment mb-6">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage
                  src={comment.picture}
                  alt={`${comment.displayName}'s avatar`}
                />
                <AvatarFallback>
                  {comment.displayName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-medium text-sm">
                    {comment.displayName}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {comment.createdAt}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
