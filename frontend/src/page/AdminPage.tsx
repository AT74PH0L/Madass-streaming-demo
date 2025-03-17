import { authenApi } from "@/api/authen";
import AdminPageDetial from "@/components/Admin/AdminPageDetial";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>("");

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

  return <AdminPageDetial adminEmail={email} />;
}
