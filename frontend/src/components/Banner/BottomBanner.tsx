import React from "react";
import { BsCheck2Circle } from "react-icons/bs";

const BottomBanner: React.FC = () => (
  <section className="mt-16 flex justify-center">
    <div className="relative w-full max-w-3xl bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 rounded-2xl shadow-xl px-8 py-8 flex flex-col items-center overflow-hidden border border-white/40">
      {/* 데코레이션 원 */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-200 rounded-full blur-2xl opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-200 rounded-full blur-2xl opacity-40 pointer-events-none"></div>
      {/* 내용 */}
      <div className="relative z-10 flex flex-col items-center">
        <BsCheck2Circle className="text-3xl text-orange-400 mb-2 drop-shadow" />
        <p className="text-xl md:text-2xl font-extrabold text-gray-800 mb-1 tracking-tight">
          PLANfolio와 함께
          <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 bg-clip-text text-transparent ml-2">
            목표를 계획하고 달성하세요!
          </span>
        </p>
        <p className="text-base text-gray-500 font-medium mt-1">
          스마트한 일정 관리로 여러분의 성장과 성공을 응원합니다.
        </p>
      </div>
    </div>
  </section>
);

export default BottomBanner;
