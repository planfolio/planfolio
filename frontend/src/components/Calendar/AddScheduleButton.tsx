import React from "react";

const AddScheduleButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="
      w-full py-2 px-4
      bg-orange-500 hover:bg-orange-600
      text-white rounded font-bold
      transition
      select-none
    "
    onClick={onClick}
    type="button"
  >
    + 일정 추가
  </button>
);

export default AddScheduleButton;
