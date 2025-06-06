import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full bg-gray-50 border-t border-gray-200 py-6 mt-8 select-none">
    <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center text-sm text-gray-500">
      <span className="font-bold text-orange-500 mr-2">PLANfolio</span>
      <span>© {new Date().getFullYear()} All rights reserved.</span>
    </div>
  </footer>
);

export default Footer;
