import React from "react";
import { BsGithub } from "react-icons/bs";

const Footer: React.FC = () => (
  <footer className="w-full bg-white/70 backdrop-blur-lg border-t border-gray-200 py-8 mt-12 select-none shadow-inner">
    <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
      {/* 로고/브랜드 */}
      <div className="flex items-center gap-2">
        <span className="font-extrabold text-transparent bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 bg-clip-text text-lg tracking-tight">
          PLANfolio
        </span>
        <span className="hidden md:inline-block text-gray-400 text-xs font-semibold ml-2">
          Your Smart Schedule Portfolio
        </span>
      </div>
      {/* 저작권/연도 */}
      <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
        <span>
          © {new Date().getFullYear()} PLANfolio. All rights reserved.
        </span>
        {/* 소셜/깃허브 등 */}
        <a
          href="https://github.com/planfolio/planfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 hover:text-orange-400 transition"
          aria-label="Github"
        >
          <BsGithub className="inline-block w-5 h-5" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
