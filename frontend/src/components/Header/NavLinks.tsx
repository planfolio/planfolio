// src/components/Header/NavLinks.tsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "./menuData"; // NAV_ITEMS 경로 변경 없음
import { useAuthStore } from "../../store/useAuthStore"; // <--- 이 줄을 추가합니다.

export const NavLinks: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // <--- 이 줄을 추가합니다.

  return (
    <nav className="flex space-x-6">
      {NAV_ITEMS.map((item) => {
        // '친구 목록' 항목이고, 로그인 상태가 아닐 경우 렌더링하지 않습니다.
        // <--- 이 조건부 블록을 추가합니다.
        if (item.name === "친구 목록" && !isAuthenticated) {
          return null;
        }
        // <--- 추가된 조건부 블록 끝.

        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`
              font-pre font-normal text-base
              ${isActive ? "text-orange-500" : "text-black"}
              hover:text-orange-500
            `}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};