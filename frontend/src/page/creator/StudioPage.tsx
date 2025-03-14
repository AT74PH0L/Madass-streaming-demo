import { authenApi } from "@/api/authen";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudioPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authenApi();
                console.log(response);
                if (response.role !== "creator") {
                    navigate("/home"); // Redirect if not a creator
                } else {
                    setLoading(false); // Authentication successful, allow rendering
                }
            } catch (error) {
                console.error("Error fetching authentication:", error);
                navigate("/home"); // Redirect if there's an error
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) return <div>Loading...</div>; // Display loading indicator while checking

    return <div>StudioPage</div>;
}
