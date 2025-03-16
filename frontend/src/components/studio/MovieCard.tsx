import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Movie } from "./type/movie";

interface MovieCardProps {
  movie: Movie;
  onEdit: () => void;
  onDelete: () => void;
}

export function MovieCard({ movie, onEdit, onDelete }: MovieCardProps) {
  return (
    <>
      <Card className="flex flex-col overflow-hidden w-full max-w-sm">
        <div className="relative w-full">
          <div className="relative aspect-[3/4] w-full">
            <img
              src={movie.pathImg || "/placeholder.svg"}
              alt={movie.name}
              className="object-cover w-full h-full"
            />
          </div>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">{movie.name}</h2>
            <div className="text-sm text-muted-foreground">
              <p>{movie.description}</p>
            </div>
          </CardContent>
        </div>

        <CardFooter className="flex justify-between pt-0 mt-auto">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </CardFooter>
      </Card>
      
    </>
  );
}