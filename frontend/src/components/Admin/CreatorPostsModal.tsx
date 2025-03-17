import type { Movie, User } from "./type";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreatorPostsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  creator: User | null;
  posts: Movie[];
}

export function CreatorPostsModal({
  isOpen,
  onOpenChange,
  creator,
  posts,
}: CreatorPostsModalProps) {
  if (!creator) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{creator.name}'s Posts</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <img
                    src={post.pathImg || "/placeholder.svg"}
                    alt={post.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="font-medium">{post.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {/* Posted on {new Date(post.createdAt).toLocaleDateString()} */}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive">Delete</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
