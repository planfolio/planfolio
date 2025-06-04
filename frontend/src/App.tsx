import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Header } from "./components/Header/Header";
import Home from "./pages/home/Home";
import CalendarPage from "./pages/calendar";
import Footer from "./components/Footer/Footer";

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
};

export default App;
