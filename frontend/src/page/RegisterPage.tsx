import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../components/register-form";
import { useEffect } from "react";
import { authenApi } from "@/api/authen";
import { AxiosError } from "axios";

export default function RegisterPage() {
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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
