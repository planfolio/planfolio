import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login");
  const handleSignupClick = () => navigate("/signup");
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate("/");
  };
  const handleLogoutClick = () => {
    setIsAuthenticated(false);
    navigate("/");
  };

  return {
    isAuthenticated,
    handleLoginClick,
    handleSignupClick,
    handleLoginSuccess,
    handleLogoutClick,
  };
}
