import React from "react";
import { Link } from "react-router-dom";

export const Logo: React.FC = () => {
  return (
    <Link
      to="/"
      className="flex items-end font-pre"
      style={{ width: "max-content" }}
    >
      <span className="text-[27px] font-bold text-orange-500 leading-none">
        PLAN
      </span>
      <span className="text-[24px] font-semibold text-black leading-none ml-1">
        folio
      </span>
    </Link>
  );
};
