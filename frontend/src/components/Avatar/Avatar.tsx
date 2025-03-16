import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserAvatar from "./Avatar-dropdown";
import { authenApi } from "../../api/authen";
import { logout } from "../../api/Logout";
type UserInfo = {
  name: string;
  email: string;
  picture: string;
  role: "user" | "creator" | "admin";
};

export default function Avatar() {
  const [userInfo, setUserRole] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  const authenticateUser = useCallback(async () => {
    try {
      const response = await authenApi();
      console.log("Authentication Response:", response);

      if (["user", "creator", "admin"].includes(response.role)) {
        setUserRole({
          name: response.displayName,
          email: response.email,
          picture: response.picture,
          role: response.role,
        });
      } else {
        console.error("Invalid role received from API");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    authenticateUser();
  }, [authenticateUser]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleStudioClick = () => {
    navigate("/studio");
  };

  const handleAdminClick = () => {
    navigate("/admin");
  };
  const handleHomelick = () => {
    navigate("/home");
  };

  if (userInfo === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <UserAvatar
            name={userInfo.name}
            email={userInfo.email}
            role={userInfo.role}
            imageUrl={userInfo.picture}
            onHome={handleHomelick}
            onLogout={handleLogout}
            onStudioClick={handleStudioClick}
            onAdminClick={handleAdminClick}
          />
        </div>
      </div>
    </div>
  );
}
