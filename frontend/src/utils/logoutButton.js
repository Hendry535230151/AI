import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} style={{ padding: "8px 16px" }}>
      Logout
    </button>
  );
};

export default LogoutButton;
