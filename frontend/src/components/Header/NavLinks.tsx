import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "./menuData";

export const NavLinks: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="flex space-x-6">
      {NAV_ITEMS.map((item) => {
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
