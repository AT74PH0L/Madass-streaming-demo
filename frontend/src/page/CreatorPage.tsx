import { authenApi } from "@/api/authen";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudioPage from "../components/studio/StudioPage";

export default function CreatorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authenApi();
        console.log(response.role);
        if (response.role !== "creator") {
          navigate("/home"); 
        } else {
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
      <StudioPage />
    </>
  );
}
