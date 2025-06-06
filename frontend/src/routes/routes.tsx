import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import CalendarPage from "../pages/calendar";
import ContestPage from "../pages/contest";
import CodingTestPage from "../pages/codingtest";
import CertificatesPage from "../pages/certificates";

interface AppRoutesProps {
  isAuthenticated: boolean;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ isAuthenticated }) => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route
      path="/calendar"
      element={<CalendarPage isAuthenticated={isAuthenticated} />}
    />
    <Route path="/contests" element={<ContestPage />} />
    <Route path="/coding-tests" element={<CodingTestPage />} />
    <Route path="/certificates" element={<CertificatesPage />} />
  </Routes>
);

export default AppRoutes;
