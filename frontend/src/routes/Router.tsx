import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/page/LoginPage";
import RegisterPage from "@/page/RegisterPage";
import HomePage from "@/page/HomePage";
import LoginWithGoogle from "@/page/LoginWithGoogle";
import MovieDetail from "@/page/MovieDetial";
import CreatorPage from "@/page/CreatorPage";
import Layout from "./Layout";
import AdminPage from "@/page/AdminPage";
import ReviewPage from "@/page/ReviewPage";
import AdminDashboardPage from "@/page/AdminDashboardPage";
import AdminMoviesPage from "@/page/AdminMoviesPage";
import CreatorDashboardage from "@/page/CreatorDashboardPage";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "/LoginWithGoogle",
        element: <LoginWithGoogle />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/movie/:id",
        element: <MovieDetail />,
      },
      {
        path: "/studio",
        element: <CreatorPage />,
      },
      {
        path: "/studio/dashboard",
        element: <CreatorDashboardage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
      {
        path: "/review/:id",
        element: <ReviewPage />,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "/admin/movies",
        element: <AdminMoviesPage />,
      },
    ],
  },
]);

export default router;
