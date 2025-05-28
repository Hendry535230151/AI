import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../utils/auth";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isTokenExpired } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isTokenExpired) {
      alert("Login session expired. Please login again!");
      navigate("/login");
    } else if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, isTokenExpired, navigate]);

  if (isAuthenticated === null) return null;
  if (isAuthenticated === false || isTokenExpired) return null;

  return children;
};

export default PrivateRoute;
