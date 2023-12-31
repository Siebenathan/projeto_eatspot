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
import CreateRecipePage from "./components/pages/CreateRecipePage";
import RecipePage from "./components/pages/RecipePage";
import RecipesPage from "./components/pages/RecipesPage";
import ErrorPage from "./components/pages/ErrorPage";
import LoginPageTest from "./components/pages/LoginPageTest";
import UserConfigurationPage from "./components/pages/userConfiguration/UserConfigurationPage";
import TermsOfServicePage from "./components/pages/TermsOfServicePage";

const browser = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/perfil/:name", element: <PerfilPage /> },
      { path: "/criar-receita", element: <CreateRecipePage /> },
      { path: "/receita/:recipeUrl", element: <RecipePage /> },
      { path: "/receitas", element: <RecipesPage /> },
      { path: "/configuracao-de-conta", element: <UserConfigurationPage /> },
      { path: "/receitas/:nomeReceita", element: <RecipesPage /> },
      { path: "/receitas/categoria/:categoria", element: <RecipesPage /> },
      { path: "/termos-de-servico", element: <TermsOfServicePage /> },
      { path: "/editar-receita", element: <CreateRecipePage />, },
    ],
  },
  {
    path: "/login2",
    element: <LoginPage />,
  },
  {
    path: "/criar-conta",
    element: <CreateAccountPage />,
  },
  {
    path: "/login",
    element: <LoginPageTest />,
  },
  {
    path: "/error",
    element: <ErrorPage />,
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

reportWebVitals();
