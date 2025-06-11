import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EventFilter from "../../components/EventComponent/EventFilter";
import EventListItem from "../../components/EventComponent/EventListItem";
import { useCertificateStore } from "../../store/useCertificatesStore";
import { useCalendarStore } from "../../store/useCalendarStore";
import { useAuthStore } from "../../store/useAuthStore";

const EXCLUDE_TAGS = ["시험", "필기", "실기", "원서접수"];
const MAIN_CERT_TAGS = [
  "정보처리기사",
  "리눅스마스터",
  "빅데이터분석기사",
  "데이터분석전문가",
  "데이터분석준전문가",
  "sql전문가",
  "sql개발자",
  "데이터아키텍처전문가",
  "데이터아키텍처 준전문가",
];

const CertificatesPage: React.FC = () => {
  const { qualifications, isLoading, fetchQualifications } =
    useCertificateStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addEvent = useCalendarStore((s) => s.addEvent);
  const deleteEvent = useCalendarStore((s) => s.deleteEvent);
  const calendarEvents = useCalendarStore((s) => s.events);
  const fetchEvents = useCalendarStore((s) => s.fetchEvents);
  const navigate = useNavigate();

  const [selected, setSelected] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);

  // 1) 자격증 목록
  useEffect(() => {
    fetchQualifications();
  }, [fetchQualifications]);

  // 페이지 마운트 시 무조건 서버 동기화 (새로고침 대응)
  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3) 필터 태그 세팅
  useEffect(() => {
    const tagSet = new Set<string>();
    qualifications.forEach((qual) =>
      qual.tags
        .replace(/\//g, ",")
        .split(",")
        .map((t) => t.trim())
        .forEach((tag) => {
          if (
            tag &&
            !EXCLUDE_TAGS.includes(tag) &&
            MAIN_CERT_TAGS.includes(tag)
          ) {
            tagSet.add(tag);
          }
        })
    );
    setFilterTags(Array.from(tagSet));
  }, [qualifications]);

  const handleFilterChange = (tag: string) => {
    if (tag === "전체") return setSelected([]);
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 북마크 여부 (날짜는 YYYY-MM-DD 형식으로 정규화해서 비교)
  const isBookmarked = (qual): boolean => {
    return calendarEvents.some((ev) => {
      const titleMatch = ev.title === qual.title;

      // 날짜를 YYYY-MM-DD 형식으로 정규화
      const normalizeDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;
        return (
          d.getFullYear() +
          "-" +
          String(d.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(d.getDate()).padStart(2, "0")
        );
      };

      const qualStartNorm = normalizeDate(qual.start_date);
      const qualEndNorm = normalizeDate(qual.end_date);
      const evStartNorm = normalizeDate(ev.start_date);
      const evEndNorm = normalizeDate(ev.end_date);

      const startMatch = qualStartNorm === evStartNorm;
      const endMatch = qualEndNorm === evEndNorm;
      const sourceMatch = ev.source === "certificate";

      return titleMatch && startMatch && endMatch && sourceMatch;
    });
  };

  // 북마크 토글 (추가/제거)
  const handleToggleBookmark = useCallback(
    async (qual) => {
      if (!isAuthenticated) {
        alert("로그인이 필요합니다!");
        navigate("/login");
        return;
      }

      // 🔥 북마크 클릭 시 무조건 서버 상태 새로고침
      await fetchEvents();

      // 최신 상태로 다시 확인
      const already = isBookmarked(qual);

      try {
        if (already) {
          // 추가된 일정의 id 찾기 (날짜 정규화로 비교)
          const normalizeDate = (date) => {
            if (!date) return null;
            const d = new Date(date);
            if (isNaN(d.getTime())) return null;
            return (
              d.getFullYear() +
              "-" +
              String(d.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(d.getDate()).padStart(2, "0")
            );
          };

          const qualStartNorm = normalizeDate(qual.start_date);
          const qualEndNorm = normalizeDate(qual.end_date);

          const ev = calendarEvents.find((ev) => {
            const evStartNorm = normalizeDate(ev.start_date);
            const evEndNorm = normalizeDate(ev.end_date);
            return (
              ev.title === qual.title &&
              qualStartNorm === evStartNorm &&
              qualEndNorm === evEndNorm &&
              ev.source === "certificate"
            );
          });

          if (ev) {
            await deleteEvent(ev.id);
            alert("캘린더에서 일정이 제거되었습니다.");
          }
        } else {
          await addEvent({
            title: qual.title,
            description: qual.description,
            start_date: qual.start_date,
            end_date: qual.end_date,
            source: "certificate",
          });
          alert("캘린더에 일정이 추가되었습니다!");
        }
      } catch (err) {
        alert(
          already ? "일정 해제에 실패했습니다." : "일정 추가에 실패했습니다."
        );
        console.error(err);
      }
    },
    [
      isAuthenticated,
      navigate,
      addEvent,
      deleteEvent,
      calendarEvents,
      fetchEvents,
    ]
  );

  const filteredQualifications =
    selected.length === 0
      ? qualifications
      : qualifications.filter((qual) => {
          const tags = qual.tags
            .replace(/\//g, ",")
            .split(",")
            .map((t) => t.trim());
          return selected.some((sel) => tags.includes(sel));
        });

  return (
    <div className="certificate-page flex max-w-6xl mx-auto p-6 gap-6 select-none">
      <aside className="w-40">
        <div className="bg-white rounded-lg shadow p-4">
          <EventFilter
            categories={["전체", ...filterTags]}
            selected={selected}
            onChange={handleFilterChange}
          />
        </div>
      </aside>
      <section className="flex-1 min-w-0 bg-white rounded-lg shadow p-4 select-none">
        {isLoading ? (
          <div className="text-gray-400 text-center py-8">불러오는 중...</div>
        ) : filteredQualifications.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            해당 분류의 자격증이 없습니다.
          </div>
        ) : (
          filteredQualifications.map((qual, idx) => (
            <EventListItem
              key={qual.title + idx}
              title={qual.title}
              date={`${qual.start_date} ~ ${qual.end_date}`}
              type={qual.tags}
              description={qual.description}
              onBookmark={() => handleToggleBookmark(qual)}
              isBookmarked={isBookmarked(qual)}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default CertificatesPage;
