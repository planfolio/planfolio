// src/AppRoutes.tsx
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

import FriendList from "../pages/friends/FriendList";       
import FriendCalendar from "../pages/friends/FriendCalendar"; 

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


    {/* 친구 관련 라우트 추가 및 경로 설정 */}
    <Route path="/friends" element={<FriendList />} /> {/* 친구 목록 및 친구 추가/요청 관리 페이지 */}
    <Route path="/friends/:username/schedule" element={<FriendCalendar />} /> {/* 특정 친구의 캘린더 보기 페이지 */}
  </Routes>
);

export default AppRoutes;