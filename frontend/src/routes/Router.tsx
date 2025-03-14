import { createBrowserRouter } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "@/page/LoginPage";
import RegisterPage from "@/page/RegisterPage";
import HomePage from "@/page/HomePage";
import LoginWithGoogle from "@/page/LoginWithGoogle";
import MovieDetail from "@/page/MovieDetial";

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
    path: "/LoginWithGoogle",
    element: <LoginWithGoogle />,
  },
  {
    // path: "/home",
    // element: (
    //   <ProtectedRoute allowedRoles={["user", "admin", "creator"]}>
    //     <HomePage />
    //   </ProtectedRoute>
    // ),

    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/movie/:id",
    element: <MovieDetail />,
  },
]);

export default router;
