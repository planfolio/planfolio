import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EventFilter from "../../components/EventComponent/EventFilter";
import EventListItem from "../../components/EventComponent/EventListItem";
import { useContestStore } from "../../store/useContestStore";
import { useCalendarStore } from "../../store/useCalendarStore";
import { useAuthStore } from "../../store/useAuthStore";

const ContestPage: React.FC = () => {
  const { contests, isLoading, fetchContests } = useContestStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addEvent = useCalendarStore((state) => state.addEvent);
  const deleteEvent = useCalendarStore((state) => state.deleteEvent);
  const calendarEvents = useCalendarStore((state) => state.events);
  const fetchEvents = useCalendarStore((state) => state.fetchEvents);
  const navigate = useNavigate();

  const [selected, setSelected] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);

  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  // 내 캘린더 일정은 마운트 시 한 번만 불러옴
  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tagSet = new Set<string>();
    contests.forEach((contest) => {
      contest.tags
        .replace(/\//g, ",")
        .split(",")
        .map((tag) => tag.trim())
        .forEach((tag) => tag && tag.length > 0 && tagSet.add(tag));
    });
    setFilterTags(Array.from(tagSet));
  }, [contests]);

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

  // 북마크 여부 (날짜는 getTime으로 비교)
  const isBookmarked = (contest): boolean =>
    calendarEvents.some(
      (ev) =>
        ev.title === contest.title &&
        new Date(ev.start_date).getTime() ===
          new Date(contest.start_date).getTime() &&
        new Date(ev.end_date).getTime() ===
          new Date(contest.end_date).getTime() &&
        ev.source === "contest"
    );

  // 북마크 토글 (추가/제거)
  const handleToggleBookmark = useCallback(
    async (contest) => {
      if (!isAuthenticated) {
        alert("로그인이 필요합니다!");
        navigate("/login");
        return;
      }
      const already = isBookmarked(contest);
      try {
        if (already) {
          // 추가된 일정의 id 찾기
          const ev = calendarEvents.find(
            (ev) =>
              ev.title === contest.title &&
              new Date(ev.start_date).getTime() ===
                new Date(contest.start_date).getTime() &&
              new Date(ev.end_date).getTime() ===
                new Date(contest.end_date).getTime() &&
              ev.source === "contest"
          );
          if (ev) {
            await deleteEvent(ev.id);
            alert("캘린더에서 일정이 제거되었습니다.");
          }
        } else {
          await addEvent({
            title: contest.title,
            description: contest.description,
            start_date: contest.start_date,
            end_date: contest.end_date,
            source: "contest",
          });
          alert("캘린더에 일정이 추가되었습니다!");
        }
        // zustand가 상태를 즉시 갱신하므로 fetchEvents() 불필요
      } catch (err) {
        alert(
          already ? "일정 해제에 실패했습니다." : "일정 추가에 실패했습니다."
        );
        console.error(err);
      }
    },
    [isAuthenticated, navigate, addEvent, deleteEvent, calendarEvents]
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
        {isLoading ? (
          <div className="text-gray-400 text-center py-8">불러오는 중...</div>
        ) : filteredEvents.length === 0 ? (
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
              onBookmark={() => handleToggleBookmark(event)}
              isBookmarked={isBookmarked(event)}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default ContestPage;
