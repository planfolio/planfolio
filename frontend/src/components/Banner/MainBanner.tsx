import React from "react";
import { BsStars } from "react-icons/bs";

const MainBanner: React.FC = () => (
  <section className="w-full flex justify-center bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 py-12 md:py-20 relative overflow-hidden">
    {/* 배경 데코레이션 */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute top-10 left-1/4 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-pink-200 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute top-1/2 left-2/3 w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-50"></div>
    </div>
    {/* 메인 카드 */}
    <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center justify-center px-6 py-10 bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40">
      <div className="flex items-center gap-2 mb-2">
        <BsStars className="text-orange-400 text-3xl drop-shadow" />
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 bg-clip-text text-transparent tracking-tight drop-shadow">
          PLANfolio에 오신 걸 환영합니다!
        </h1>
      </div>
      <p className="text-lg md:text-xl text-gray-700 font-semibold mb-2 text-center">
        <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          공모전, 코딩테스트, 자격증 일정
        </span>
        을 한눈에, 한 번에 관리하세요.
      </p>
      <div className="flex gap-2 mt-2">
        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-500 rounded-full text-sm font-bold shadow">
          #일정관리
        </span>
        <span className="inline-block px-3 py-1 bg-pink-100 text-pink-500 rounded-full text-sm font-bold shadow">
          #공모전
        </span>
        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-500 rounded-full text-sm font-bold shadow">
          #코딩테스트
        </span>
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-sm font-bold shadow">
          #자격증
        </span>
      </div>
    </div>
  </section>
);

export default MainBanner;
