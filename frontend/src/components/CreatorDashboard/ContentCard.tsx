import { Play } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface ContentCardProps {
  title: string;
  image: string;
  views: string;
  date: string;
}

export function ContentCard({ title, image, views, date }: ContentCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <img src={image} alt={title} className="object-cover" />
        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="sm" variant="secondary">
            <Play className="h-4 w-4 mr-1" />
            Play
          </Button>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium line-clamp-1">{title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <span>{views} views</span>
          <span>{date}</span>
        </div>
      </CardContent>
    </Card>
  );
}
