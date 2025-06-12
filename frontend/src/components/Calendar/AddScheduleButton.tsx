import React from "react";

const AddScheduleButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="
      group w-full py-4 px-6
      bg-gradient-to-r from-orange-500 via-pink-500 to-red-500
      hover:from-orange-600 hover:via-pink-600 hover:to-red-600
      text-white rounded-2xl font-bold text-lg
      transition-all duration-200 transform hover:scale-[1.02]
      shadow-lg hover:shadow-xl
      select-none
      border-2 border-transparent hover:border-white/20
    "
    onClick={onClick}
    type="button"
  >
    <div className="flex items-center justify-center gap-2">
      <span className="text-2xl group-hover:rotate-90 transition-transform duration-200">
        +
      </span>
      <span>일정 추가</span>
    </div>
  </button>
);

export default AddScheduleButton;
