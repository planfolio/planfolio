type FilterProps = {
  categories: string[];
  selected: string[];
  onChange: (category: string) => void;
};

const EventFilter: React.FC<FilterProps> = ({
  categories,
  selected,
  onChange,
}) => (
  <div>
    <h2 className="font-bold mb-3 text-gray-700 text-base">분류별 필터</h2>
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive =
          cat === "전체" ? selected.length === 0 : selected.includes(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={`
              px-4 py-1 rounded-full text-sm font-medium
              border transition
              ${
                isActive
                  ? "bg-orange-100 text-orange-600 border-orange-200 shadow"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-orange-50"
              }
              focus:outline-none focus:ring-1 focus:ring-orange-300
            `}
            aria-pressed={isActive}
          >
            {cat}
          </button>
        );
      })}
    </div>
  </div>
);

export default EventFilter;
