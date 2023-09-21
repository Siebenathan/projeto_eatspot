import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import HomePage from "./components/pages/HomePage";
import PerfilPage from "./components/pages/PerfilPage";
import Layout from "./components/pages/Layout";
import CreateAccountPage from "./components/pages/CreateAccountPage";
import PrivatePage from "./components/pages/PrivatePage";
import AdminPage from "./components/pages/adminPages/AdminPage";

const browser = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/teste", element: <PerfilPage /> },
    ],
  },
  {
    path: "/criar-conta",
    element: <CreateAccountPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <PrivatePage />,
    children: [
      {
        path: "/admin",
        element: <AdminPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={browser}></RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
