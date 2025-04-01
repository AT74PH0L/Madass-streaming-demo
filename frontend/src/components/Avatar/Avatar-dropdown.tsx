import { HomeIcon, LogOut, Palette, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

type UserRole = "user" | "creator" | "admin";

interface UserAvatarProps {
  name: string;
  email: string;
  imageUrl?: string;
  role: UserRole;
  onHome: () => void;
  onLogout: () => void;
  onStudioClick?: () => void;
  onAdminClick?: () => void;
}

export default function UserAvatar({
  name,
  email,
  imageUrl,
  role,
  onHome,
  onLogout,
  onStudioClick,
  onAdminClick,
}: UserAvatarProps) {
  // Get initials from name
  const navigate = useNavigate();
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-10 w-10 cursor-pointer">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback className="text-black">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onHome} className="cursor-pointer">
          <HomeIcon className="mr-2 h-4 w-4" />
          <span>Home</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        {/* Show different options based on role */}
        {role === "admin" && (
          <DropdownMenuItem onClick={onAdminClick} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Admin</span>
          </DropdownMenuItem>
        )}

        {(role === "creator" || role == "admin") && (
          <DropdownMenuItem onClick={onStudioClick} className="cursor-pointer">
            <Palette className="mr-2 h-4 w-4" />
            <span>Studio</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
