import React from "react";

interface ScheduleFilterProps {
  filters: string[];
  selected: string;
  onSelect: (filter: string) => void;
}

const ScheduleFilter: React.FC<ScheduleFilterProps> = ({
  filters,
  selected,
  onSelect,
}) => (
  <div className="flex flex-col gap-2 select-none">
    {filters.map((filter) => (
      <button
        key={filter}
        className={`text-left px-2 py-1 rounded transition
          ${
            selected === filter
              ? "bg-orange-100 text-orange-500 font-bold"
              : "hover:bg-orange-50 text-gray-700"
          }
        `}
        onClick={() => onSelect(filter)}
        type="button"
      >
        {filter}
      </button>
    ))}
  </div>
);

export default ScheduleFilter;
