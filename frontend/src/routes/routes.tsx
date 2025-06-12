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

// friend 폴더에서 컴포넌트 임포트 경로 및 파일명 최종 반영
import LoginIdPage from "../pages/Login/loginid";
import LoginPasswordPage from "../pages/Login/loginpassword";
import FriendList from "../pages/friends/FriendList";       // 파일명 변경 반영
import FriendCalendar from "../pages/friends/FriendCalendar"; // 파일명 변경 반영

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
    <Route path="/find-username" element={<LoginIdPage />} />
    <Route path="/reset-password" element={<LoginPasswordPage />} />

    {/* 친구 관련 라우트 추가 및 경로 설정 */}
    <Route path="/friends" element={<FriendList />} /> {/* 친구 목록 및 친구 추가/요청 관리 페이지 */}
    <Route path="/friends/:username/schedule" element={<FriendCalendar />} /> {/* 특정 친구의 캘린더 보기 페이지 */}
  </Routes>
);

export default AppRoutes;