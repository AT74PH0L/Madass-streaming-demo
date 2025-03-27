import { authenApi } from "@/api/authen";
import AdminPageDetial from "@/components/Admin/AdminPageDetial";
import { Button } from "@/components/ui/button";
import { Clapperboard, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>("");

  const handleOnClick = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenApi();
        if (response.role != "admin") {
          navigate("/home");
        } else {
          setEmail(response.email);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching authentication:", error);
        navigate("/home");
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-8 ml-10 mr-10">
        <h1 className="text-3xl font-bold">Back office</h1>
        <div className="flex gap-2">
          <Button onClick={() => handleOnClick("/admin/dashboard")}>
            <LayoutDashboard /> Dashboard
          </Button>
          <Button onClick={() => handleOnClick("/admin/movies")}>
            <Clapperboard /> All movies
          </Button>
        </div>
      </div>
      <AdminPageDetial adminEmail={email} />;
    </>
  );
}
