import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ResetPassword from "./pages/ResetPassword";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot_password", element: <ForgotPassword /> },
  { path: "/reset_password", element: <ResetPassword /> },
  { path: "/home", element: <Home /> },
  { path: "/chat", element: <Chat /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
