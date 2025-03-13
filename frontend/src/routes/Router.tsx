import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "@/page/LoginPage";
import RegisterPage from "@/page/RegisterPage";
import HomePage from "@/page/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute allowedRoles={["user", "admin","creator"]}> 
        <HomePage />
      </ProtectedRoute>
    ),

      // path: "/home",
      // element: <HomePage />,
  },
]);

export default router;
