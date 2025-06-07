import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EventFilter from "../../components/EventComponent/EventFilter";
import EventListItem from "../../components/EventComponent/EventListItem";
import type { CodingTest } from "../../types/codingTest";

interface CodingTestPageProps {
  isAuthenticated: boolean;
}

const CodingTestPage: React.FC<CodingTestPageProps> = ({ isAuthenticated }) => {
  const [tests, setTests] = useState<CodingTest[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/coding-tests")
      .then((res) => {
        const data: CodingTest[] = Array.isArray(res.data) ? res.data : [];
        setTests(data);

        const tagSet = new Set<string>();
        data.forEach((test) => {
          test.tags
            .replace(/\//g, ",")
            .split(",")
            .map((tag) => tag.trim())
            .forEach((tag) => tag && tag.length > 0 && tagSet.add(tag));
        });
        setFilterTags(Array.from(tagSet));
      })
      .catch((err) => {
        console.error("코딩테스트 데이터 불러오기 실패", err);
      });
  }, []);

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
    (test: CodingTest) => {
      if (!isAuthenticated) {
        alert("로그인이 필요합니다!");
        navigate("/login");
        return;
      }
      axios
        .post("http://localhost:3000/calendar", {
          title: test.title,
          description: test.description,
          start_date: test.start_date,
          end_date: test.end_date,
          source: "codingtest",
        })
        .then(() => {
          alert("내 캘린더에 추가되었습니다!");
        })
        .catch((err) => {
          alert("추가에 실패했습니다.");
          console.error(err);
        });
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
        {filteredTests.length === 0 ? (
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
