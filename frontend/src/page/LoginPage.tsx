import { useEffect } from "react";
import LoginForm from "../components/login-form";
import { authenApi } from "@/api/authen";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
export default function LoginPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenApi();
        console.log(response);
        if (!(response instanceof AxiosError)) {
          navigate("/home");
        }
      } catch (error) {
        console.error("Error fetching authentication:", error);
      }
    };

    fetchData();
  }, [navigate]);
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
