import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import CalendarPage from "../pages/calendar";
import ContestPage from "../pages/contest";
import CodingTestPage from "../pages/codingtest";
import CertificatesPage from "../pages/certificates";
import LoginPage from "../pages/Login";
import SignupPage from "../pages/Signup";
import MyPage from "../components/Mypage/MyPage";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/calendar" element={<CalendarPage />} />
    <Route path="/contests" element={<ContestPage />} />
    <Route path="/coding-tests" element={<CodingTestPage />} />
    <Route path="/certificates" element={<CertificatesPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/mypage" element={<MyPage />} />
  </Routes>
);

export default AppRoutes;
