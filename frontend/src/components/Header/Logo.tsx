import React from "react";
import { Link } from "react-router-dom";

export const Logo: React.FC = () => {
  return (
    <Link
      to="/"
      className="flex items-center font-pre"
      style={{ width: "max-content" }}
      aria-label="PLANfolio 홈으로"
    >
      <span
        className="text-[28px] font-extrabold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 bg-clip-text text-transparent tracking-tight leading-none"
        style={{ letterSpacing: "-0.03em" }}
      >
        PLANfolio
      </span>
    </Link>
  );
};
