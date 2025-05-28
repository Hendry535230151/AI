import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../utils/auth";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/chat");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === null) return <p>Checking...</p>;
  if (isAuthenticated === true) return null;

  return children;
};

export default PublicRoute;
