import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
// import CreatorProfilePage from "../pages/CreatorProfilePage";
// import DonorProfilePage from "../pages/DonorProfilePage";
import ProjectsPage from "../pages/ProjectsPage";
import Login from "../pages/Login";
import Project from "../pages/Project";
import Layout from "@/components/Layout";
import Profile from "@/pages/Profile";

export enum Routes {
  HOME = "/",
  LOGIN = "/login",
  PROJECTS = "/projects",
  PROJECT = "/projects/:projectId",
  DONOR_PROFILE = "/donor/profile",
  CREATOR_PROFILE = "/creator/profile",
  PROFILE="/profile"
}

const AppRoutes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: Routes.HOME, element: <HomePage /> },
      { path: Routes.PROJECT, element: <Project /> },
      { path: Routes.PROJECTS, element: <ProjectsPage /> },
      { path: Routes.LOGIN, element: <Login /> },
      { path: Routes.DONOR_PROFILE, element: <Profile/>},
      { path: Routes.CREATOR_PROFILE, element: <Profile/>},
      { path: Routes.PROFILE, element: <Profile/>}
      // { path: Routes.DONOR_PROFILE, element: <DonorProfilePage /> },
      // { path: Routes.CREATOR_PROFILE, element: <CreatorProfilePage /> },
    ],
  },
]);

export default AppRoutes;
