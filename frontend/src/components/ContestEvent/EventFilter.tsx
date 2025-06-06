// EventFilter.tsx
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
    <h2 className="font-bold mb-3">분류별 필터</h2>
    {categories.map((cat, idx) => (
      <label key={cat} className="block mb-2">
        <input
          type="checkbox"
          checked={
            cat === "전체"
              ? selected.length === 0 // 전체는 selected가 비어있을 때만 체크
              : selected.includes(cat)
          }
          onChange={() => onChange(cat)}
          className="mr-2"
        />
        {cat}
      </label>
    ))}
  </div>
);

export default EventFilter;
