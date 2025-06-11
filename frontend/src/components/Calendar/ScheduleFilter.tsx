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
}) => {
  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case "전체":
        return "📊";
      case "공모전":
        return "🏆";
      case "자격증":
        return "🎓";
      case "코딩테스트":
        return "💻";
      case "개인":
        return "📝";
      default:
        return "📌";
    }
  };

  return (
    <div className="flex flex-col gap-2 select-none">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`group flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 border ${
            selected === filter
              ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg border-transparent transform scale-105"
              : "hover:bg-orange-50 text-gray-600 border-transparent hover:border-orange-200 hover:shadow-md"
          }`}
          onClick={() => onSelect(filter)}
          type="button"
        >
          <span className="text-lg">{getFilterIcon(filter)}</span>
          <span
            className={`font-medium ${
              selected === filter ? "text-white" : "text-gray-700"
            }`}
          >
            {filter}
          </span>
          {selected === filter && (
            <span className="ml-auto">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ScheduleFilter;
