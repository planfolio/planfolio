import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EventFilter from "../../components/EventComponent/EventFilter";
import EventListItem from "../../components/EventComponent/EventListItem";
import { useCodingTestStore } from "../../store/useCodingTestStore";
import { useAuthStore } from "../../store/useAuthStore";

const CodingTestPage: React.FC = () => {
  const { tests, isLoading, fetchTests } = useCodingTestStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [selected, setSelected] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  useEffect(() => {
    // 모든 tags를 중복 없이 추출
    const tagSet = new Set<string>();
    tests.forEach((test) => {
      test.tags
        .replace(/\//g, ",")
        .split(",")
        .map((tag) => tag.trim())
        .forEach((tag) => tag && tag.length > 0 && tagSet.add(tag));
    });
    setFilterTags(Array.from(tagSet));
  }, [tests]);

  const handleFilterChange = (tag: string) => {
    if (tag === "전체") {
      setSelected([]);
    } else {
      setSelected((prev) => {
        const next = prev.includes(tag)
          ? prev.filter((t) => t !== tag)
          : [...prev, tag];
        return next.length === 0 ? [] : next;
      });
    }
  };

  // 북마크(내 캘린더 추가) 핸들러
  const handleBookmark = useCallback(
    (test) => {
      if (!isAuthenticated) {
        alert("로그인이 필요합니다!");
        navigate("/login");
        return;
      }
      // 북마크 추가 API (예시)
      // await axios.post("http://localhost:3000/calendar", { ... })
      alert("내 캘린더에 추가되었습니다!");
    },
    [isAuthenticated, navigate]
  );

  const filteredTests =
    selected.length === 0
      ? tests
      : tests.filter((test) => {
          const tags = test.tags
            .replace(/\//g, ",")
            .split(",")
            .map((t) => t.trim());
          return selected.some((sel) => tags.includes(sel));
        });

  return (
    <div className="coding-test-page flex max-w-6xl mx-auto p-6 gap-6 select-none">
      {/* 좌측: 필터 */}
      <aside className="w-40">
        <div className="bg-white rounded-lg shadow p-4">
          <EventFilter
            categories={["전체", ...filterTags]}
            selected={selected}
            onChange={handleFilterChange}
          />
        </div>
      </aside>

      {/* 우측: 리스트 */}
      <section className="flex-1 min-w-0 bg-white rounded-lg shadow p-4 select-none">
        {isLoading ? (
          <div className="text-gray-400 text-center py-8">불러오는 중...</div>
        ) : filteredTests.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            해당 분류의 코딩테스트가 없습니다.
          </div>
        ) : (
          filteredTests.map((test, idx) => (
            <EventListItem
              key={test.title + idx}
              title={test.title}
              date={`${test.start_date} ~ ${test.end_date}`}
              type={test.tags}
              description={test.description}
              onBookmark={() => handleBookmark(test)}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default CodingTestPage;
