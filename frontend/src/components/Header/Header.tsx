import React from "react";
import { NavLinks } from "./NavLinks";
import { Logo } from "./Logo";
import AuthButtons from "./AuthButtons";

export const Header: React.FC = () => {
  return (
    <header className="header sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm select-none transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Logo />
          <div className="flex items-center ml-auto">
            <nav className="flex">
              <NavLinks />
            </nav>
            <div className="ml-8 flex items-center space-x-4">
              <AuthButtons />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
