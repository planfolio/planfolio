import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import CalendarPage from "../pages/calendar";
import ContestPage from "../pages/contest";
import CodingTestPage from "../pages/codingtest";
import CertificatesPage from "../pages/certificates";
import Signup from "../pages/signup/Signup";
import Login from "../pages/login/Login";
import Mypage from "../pages/mypage/Mypage"; // ✅ 마이페이지 import

interface AppRoutesProps {
  isAuthenticated: boolean;
  onLoginSuccess: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  isAuthenticated,
  onLoginSuccess,
}) => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route
      path="/calendar"
      element={<CalendarPage isAuthenticated={isAuthenticated} />}
    />
    <Route
      path="/contests"
      element={<ContestPage isAuthenticated={isAuthenticated} />}
    />
    <Route
      path="/coding-tests"
      element={<CodingTestPage isAuthenticated={isAuthenticated} />}
    />
    <Route
      path="/certificates"
      element={<CertificatesPage isAuthenticated={isAuthenticated} />}
    />
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login onLoginSuccess={onLoginSuccess} />} />

    <Route path="/mypage" element={<Mypage />} /> 
  </Routes>
);

export default AppRoutes;
