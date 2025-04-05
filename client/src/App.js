import "./App.css";
import Layout from "./layout/Layout";
import HomePage from "./components/HomePage";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
  ]);
  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  );
}

export default App;
