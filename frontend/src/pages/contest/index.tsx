import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EventFilter from "../../components/EventComponent/EventFilter";
import EventListItem from "../../components/EventComponent/EventListItem";
import type { Contest } from "../../types/contest";

interface ContestPageProps {
  isAuthenticated: boolean;
}

const ContestPage: React.FC<ContestPageProps> = ({ isAuthenticated }) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/contests")
      .then((res) => {
        const data: Contest[] = Array.isArray(res.data) ? res.data : [];
        setContests(data);

        const tagSet = new Set<string>();
        data.forEach((contest) => {
          contest.tags
            .replace(/\//g, ",")
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
    (contest: Contest) => {
      if (!isAuthenticated) {
        alert("로그인이 필요합니다!");
        navigate("/login");
        return;
      }
      axios
        .post("http://localhost:3000/calendar", {
          title: contest.title,
          description: contest.description,
          start_date: contest.start_date,
          end_date: contest.end_date,
          source: "contest",
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
    <div className="contest-page flex max-w-6xl mx-auto p-6 gap-6 select-none">
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
              onBookmark={() => handleBookmark(event)}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default ContestPage;
