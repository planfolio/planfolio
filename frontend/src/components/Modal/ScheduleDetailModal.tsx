import React from "react";

const ScheduleDetailModal = ({ event, onClose, onEdit, onDelete }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
    <div
      className="
      bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl
      px-16 py-14 min-w-[700px] max-w-2xl
      flex flex-col gap-10 border border-orange-100
      relative
    "
    >
      {/* 닫기(X) 버튼 (오른쪽 상단) */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-orange-50 hover:bg-orange-100 text-orange-400 hover:text-orange-500 transition"
        aria-label="닫기"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 7l10 10M7 17L17 7" strokeLinecap="round" />
        </svg>
      </button>

      {/* 일정 제목 */}
      <h2 className="text-4xl font-extrabold text-orange-500 tracking-tight mb-2">
        {event.title}
      </h2>

      {/* 설명 */}
      <div className="text-xl text-gray-700 whitespace-pre-line leading-relaxed mb-2">
        {event.description || (
          <span className="text-gray-400">설명이 없습니다.</span>
        )}
      </div>

      {/* 일정 정보 */}
      <div className="flex flex-col gap-4 text-lg">
        <div className="flex items-center gap-4">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
          <span className="font-semibold text-gray-500">시작</span>
          <span className="text-gray-700">
            {new Date(event.start_date).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="inline-block w-2 h-2 rounded-full bg-pink-400" />
          <span className="font-semibold text-gray-500">종료</span>
          <span className="text-gray-700">
            {new Date(event.end_date).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-base rounded-full bg-orange-100 text-orange-500 px-4 py-1 font-semibold">
            {event.source === "manual"
              ? "내 일정"
              : event.source === "contest"
              ? "공모전"
              : event.source === "certificate"
              ? "자격증"
              : event.source === "codingtest"
              ? "코딩테스트"
              : event.source}
          </span>
        </div>
      </div>

      {/* 하단 버튼: 수정/삭제(같은 줄), 닫기(아래 단독) */}
      <div className="flex gap-3 mt-8">
        <button
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-pink-400 text-white font-bold text-lg shadow hover:scale-105 transition"
          onClick={onEdit}
        >
          일정 수정
        </button>
        <button
          className="flex-1 py-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 font-bold text-lg"
          onClick={onDelete}
        >
          일정 삭제
        </button>
      </div>
      <button
        className="mt-6 w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg"
        onClick={onClose}
      >
        닫기
      </button>
    </div>
  </div>
);

export default ScheduleDetailModal;
