import React, { useEffect, useState } from "react";
import axios from "axios";
import EventFilter from "../../components/ContestEvent/EventFilter";
import EventListItem from "../../components/ContestEvent/EventListItem";
import type { Contest } from "../../types/contest";

const ContestPage: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/contests")
      .then((res) => {
        const data: Contest[] = Array.isArray(res.data) ? res.data : [];
        setContests(data);

        // 모든 tags를 모아서 중복 없이 추출
        const tagSet = new Set<string>();
        data.forEach((contest) => {
          contest.tags
            .replace(/\//g, ",") // "게임/소프트웨어" → "게임,소프트웨어"
            .split(",")
            .map((tag) => tag.trim())
            .forEach((tag) => tag && tag.length > 0 && tagSet.add(tag));
        });
        setFilterTags(Array.from(tagSet));
      })
      .catch((err) => {
        console.error("공모전 데이터 불러오기 실패", err);
      });
  }, []);

  // 필터 변경 핸들러
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

  // 필터링된 데이터
  const filteredEvents =
    selected.length === 0
      ? contests
      : contests.filter((event) => {
          const tags = event.tags
            .replace(/\//g, ",")
            .split(",")
            .map((t) => t.trim());
          return selected.some((sel) => tags.includes(sel));
        });

  return (
    <div className="flex max-w-6xl mx-auto p-6 gap-6">
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
      <section className="flex-1 min-w-0 bg-white rounded-lg shadow p-4">
        {filteredEvents.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            해당 분류의 공모전이 없습니다.
          </div>
        ) : (
          filteredEvents.map((event, idx) => (
            <EventListItem
              key={event.title + idx}
              title={event.title}
              date={`${event.start_date} ~ ${event.end_date}`}
              type={event.tags}
              description={event.description}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default ContestPage;
