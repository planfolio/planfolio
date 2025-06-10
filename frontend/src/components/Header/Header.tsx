import React from "react";
import { useNavigate } from "react-router-dom";
import { NavLinks } from "./NavLinks";
import { Logo } from "./Logo";
import AuthButtons from "./AuthButtons";
import { FiUser } from "react-icons/fi";

interface HeaderProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoutClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAuthenticated,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
}) => {
  const navigate = useNavigate();

  const handleMypageClick = () => {
    // 백엔드 연동 시 아래 조건 사용:
    // if (isAuthenticated) {
    //   navigate("/mypage");
    // } else {
    //   navigate("/login");
    // }

    // 현재는 로그인 여부와 상관없이 마이페이지로 이동
    navigate("/mypage");
  };

  return (
    <header className="header sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm select-none transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 왼쪽: 로고 */}
          <Logo />

          {/* 가운데: 네비게이션 메뉴 */}
          <nav className="ml-8">
            <NavLinks />
          </nav>

          {/* 오른쪽: 버튼 그룹 */}
          <div className="flex items-center gap-3 ml-8">
            {/* 로그인/회원가입 or 로그아웃 */}
            <AuthButtons
              isAuthenticated={isAuthenticated}
              onLoginClick={onLoginClick}
              onSignupClick={onSignupClick}
              onLogoutClick={onLogoutClick}
            />

            {/* 마이페이지 텍스트 버튼 */}
            <button
              onClick={handleMypageClick}
              className="px-4 py-2 text-sm font-semibold text-white bg-gray-700 rounded-full hover:bg-gray-800 transition"
            >
              마이페이지
            </button>

            {/* 마이페이지 아이콘 버튼 */}
            <button
              onClick={handleMypageClick}
              className="p-2 rounded-full border border-orange-300 text-orange-500 hover:bg-orange-50 transition"
              title="마이페이지"
            >
              <FiUser className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
