import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/routes";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate("/");
  };

  const handleLogoutClick = () => {
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onLogoutClick={handleLogoutClick}
      />

      <main className="pt-4">
        <AppRoutes />
      </main>
      <Footer />
    </>
  );
};

export default App;
