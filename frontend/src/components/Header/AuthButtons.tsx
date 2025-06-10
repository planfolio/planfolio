import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const AuthButtons: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login");
  const handleSignupClick = () => navigate("/signup");
  const handleLogoutClick = () => {
    logout();
    navigate("/"); // 로그아웃 후 홈으로 이동 등
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={handleLoginClick}
          className="
            px-5 py-2 text-sm font-pre font-semibold text-white
            bg-orange-500 rounded-full hover:bg-orange-600
            focus:outline-none focus:ring-2 focus:ring-orange-400
            shadow
          "
        >
          로그인
        </button>
        <button
          onClick={handleSignupClick}
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
  return (
    <button
      onClick={handleLogoutClick}
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
