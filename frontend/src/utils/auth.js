import { useState, useEffect } from "react";

let setAuthExternal = null;

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    fetch("http://localhost:3000/middleware/verify-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          setIsAuthenticated(false);
          setIsTokenExpired(true);
          localStorage.removeItem("token");
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  setAuthExternal = () => {
    setIsAuthenticated(false);
    setIsTokenExpired(true);
  };

  return { isAuthenticated, isTokenExpired };
};

export const expireSession = () => {
  if (setAuthExternal) setAuthExternal();
};

export default useAuth;
