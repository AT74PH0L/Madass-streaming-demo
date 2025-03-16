import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/provider/AuthProvider";
import { authenApi } from "@/api/authen";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export default function LoginWithGoogle() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false); // เก็บสถานะการเรียก API
  
  useEffect(() => {
    const authenticateUser = async () => {
      if (isAuthenticating || authContext?.user) return; // หยุดถ้ากำลังเรียก API หรือผู้ใช้ล็อกอินแล้ว

      setIsAuthenticating(true); // ตั้งค่าสถานะให้รู้ว่ากำลังเรียก API

      try {
        const response = await authenApi();

        if (!authContext) {
          console.error("AuthContext is not available");
          toast.error("AuthContext is not available");
          return;
        }

        if (response.statusCode === 401) {
          toast.error(response.message || "Unauthorized: Please log in.");
          return;
        }

        // authContext.login(response); // ส่งค่าผู้ใช้ที่ได้ไปเก็บใน Context
        toast.success("Welcome to MADASS");

        setTimeout(() => {
          navigate("/home");
        }, 0);
        
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            toast.error("Unauthorized: Please log in.");
          } else {
            toast.error(error.response?.data.message || "An error occurred with the API.");
          }
        } else {
          console.error("An unexpected error occurred", error);
        }
        
        setTimeout(() => {
          navigate("/");
        },0);
      } finally {
        setIsAuthenticating(false);
      }
    };

    authenticateUser();
  }, [authContext, navigate, isAuthenticating]);

  return <div>Login With Google</div>;
}
