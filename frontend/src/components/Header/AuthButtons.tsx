import React from "react";

interface AuthButtonsProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoutClick?: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({
  isAuthenticated,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
}) => {
  if (!isAuthenticated) {
    return (
      <>
        {/* 로그인 버튼 */}
        <button
          onClick={onLoginClick}
          className="
            px-4 py-2 text-sm font-pre font-semibold text-white 
            bg-orange-500 rounded-full hover:bg-orange-600
            focus:outline-none focus:ring-2 focus:ring-orange-500
          "
        >
          로그인
        </button>
        {/* 회원가입 버튼 */}
        <button
          onClick={onSignupClick}
          className="
            px-4 py-2 text-sm font-pre font-semibold text-orange-500 
            border border-orange-500 rounded-full hover:bg-orange-50
            focus:outline-none focus:ring-2 focus:ring-orange-500
          "
        >
          회원가입
        </button>
      </>
    );
  }
  // 로그인 상태: 로그아웃 버튼만
  return (
    <button
      onClick={onLogoutClick}
      className="
        px-4 py-2 text-sm font-pre font-semibold text-orange-500 
        border border-orange-500 rounded-full hover:bg-orange-50
        focus:outline-none focus:ring-2 focus:ring-orange-500
      "
    >
      로그아웃
    </button>
  );
};

export default AuthButtons;
