import type { User } from "./type";
import { Ban, ArrowUp, Image, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ConfirmDeleteUser } from "./ConfirmDeleteUser";

interface UserCardProps {
  user: User;
  onDeleteUser: (userId: string) => void;
  onUpgradeUser: (
    userId: string,
    newRole: "admin" | "creator" | "user"
  ) => void;
  onViewPosts?: (user: User) => void;
}

export function UserCard({
  user,
  onDeleteUser,
  onUpgradeUser,
  onViewPosts,
}: UserCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const onConfirmDelete = () => {
    onDeleteUser(user.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card>
      <CardContent className="">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={
                user.role === "admin"
                  ? "default"
                  : user.role === "creator"
                  ? "secondary"
                  : "outline"
              }
            >
              {user.role}
            </Badge>
          </div>

          <div className="flex gap-2">
            {user.role === "creator" && onViewPosts && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewPosts(user)}
              >
                <Image className="h-4 w-4 mr-2" />
                View Posts
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Ban className="h-4 w-4 mr-2" />
              Delete user
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowUp className="h-4 w-4" />
                  Change Role
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => onUpgradeUser(user.id, "admin")}
                  disabled={user.role === "admin"}
                >
                  Set as Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpgradeUser(user.id, "creator")}
                  disabled={user.role === "creator"}
                >
                  Set as Creator
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpgradeUser(user.id, "user")}
                  disabled={user.role === "user"}
                >
                  Set as User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>

      <ConfirmDeleteUser
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userName={user.name}
        onConfirm={onConfirmDelete}
      />
    </Card>
  );
}
