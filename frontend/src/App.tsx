import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Header } from "./components/Header/Header";
import Home from "./pages/Home";
// 아직 개발 전 페이지들은 주석 처리
// import CalendarPage from "./pages/CalendarPage";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";

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
          {/* 다음 페이지들은 차후 개발 시 주석 해제 */}
        </Routes>
      </main>
    </>
  );
};

export default App;
