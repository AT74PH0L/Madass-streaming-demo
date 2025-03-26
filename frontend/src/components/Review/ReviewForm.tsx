import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comments } from "./type";

interface ReviewFormProb {
  comments: Comments[];
  addComment: (commnentTxt: string) => void;
}
export default function ReviewForm({ comments, addComment }: ReviewFormProb) {
  const [commentText, setCommentText] = useState("");
  const commentCount = comments.reduce((count) => count + 1, 0);

  const handleAddComment = () => {
    addComment(commentText);
    setCommentText("");
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-2">{commentCount} Reviews</h2>

      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1">
          <Textarea
            placeholder="Add a review..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[40px] resize-none border-b border-t-0 border-l-0 border-r-0 rounded-none focus-visible:ring-0 focus-visible:border-gray-900 dark:focus-visible:border-gray-100 px-0"
          />
        </div>
      </div>

      {commentText && (
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={() => setCommentText("")}>
            Cancel
          </Button>
          <Button onClick={handleAddComment}>Comment</Button>
        </div>
      )}
    </>
  );
}
