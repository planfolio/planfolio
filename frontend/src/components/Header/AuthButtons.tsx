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
      <div className="flex items-center gap-3">
        {/* 로그인 버튼: 기존 단색 오렌지 */}
        <button
          onClick={onLoginClick}
          className="
            px-5 py-2 text-sm font-pre font-semibold text-white
            bg-orange-500 rounded-full hover:bg-orange-600
            focus:outline-none focus:ring-2 focus:ring-orange-400
            shadow
          "
        >
          로그인
        </button>
        {/* 회원가입 버튼: 글래스모피즘 스타일 */}
        <button
          onClick={onSignupClick}
          className="
            px-5 py-2 text-sm font-pre font-semibold text-orange-500
            bg-white/70 backdrop-blur-md border border-orange-300
            rounded-full shadow hover:bg-orange-50 hover:scale-105 transition
            focus:outline-none focus:ring-2 focus:ring-orange-300
          "
        >
          회원가입
        </button>
      </div>
    );
  }
  // 로그인 상태: 로그아웃 버튼만
  return (
    <button
      onClick={onLogoutClick}
      className="
        px-5 py-2 text-sm font-pre font-semibold text-orange-500
        bg-white/70 backdrop-blur-md border border-orange-300
        rounded-full shadow hover:bg-orange-50 hover:scale-105 transition
        focus:outline-none focus:ring-2 focus:ring-orange-300
      "
    >
      로그아웃
    </button>
  );
};

export default AuthButtons;
