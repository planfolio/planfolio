import React from "react";
import { NavLinks } from "./NavLinks";
import { Logo } from "./Logo";
import AuthButtons from "./AuthButtons"; // 추가

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
  return (
    <header className="header bg-white border-b border-gray-200 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Logo />
          <div className="flex items-center ml-auto">
            <nav className="flex">
              <NavLinks />
            </nav>
            <div className="ml-8 flex items-center space-x-4">
              <AuthButtons
                isAuthenticated={isAuthenticated}
                onLoginClick={onLoginClick}
                onSignupClick={onSignupClick}
                onLogoutClick={onLogoutClick}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
