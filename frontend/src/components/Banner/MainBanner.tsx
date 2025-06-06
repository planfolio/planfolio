import React from "react";

const MainBanner: React.FC = () => (
  <section className="w-full flex justify-center bg-orange-100">
    <div className="w-full max-w-5xl flex flex-col items-start justify-center py-8 px-4 select-none">
      <h1 className="text-2xl md:text-3xl font-bold text-orange-500 mb-2 text-left drop-shadow">
        PLANfolio에 오신 걸 환영합니다!
      </h1>
      <p className="text-base md:text-lg text-orange-400 mb-4 text-left">
        공모전, 코딩테스트, 자격증 일정을 한눈에 관리하세요.
      </p>
    </div>
  </section>
);

export default MainBanner;
