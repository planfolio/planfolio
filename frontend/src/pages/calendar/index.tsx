import React, { useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import koLocale from "@fullcalendar/core/locales/ko";
import AddScheduleButton from "../../components/Calendar/AddScheduleButton";
import ScheduleFilter from "../../components/Calendar/ScheduleFilter";
import "../../styles/FullCalendar.css";
import { useNavigate } from "react-router-dom";
import { useCalendarStore } from "../../store/useCalendarStore";
import { useAuthStore } from "../../store/useAuthStore";

const FILTERS = ["전체", "공모전", "자격증", "코딩테스트", "개인"];

const CalendarPage: React.FC = () => {
  const { events, isLoading, fetchEvents, addEvent } = useCalendarStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [selected, setSelected] = React.useState("전체");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAddSchedule = useCallback(() => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다!");
      navigate("/login");
      return;
    }
    // 예시: 일정 추가 폼/모달 띄우고, 완료 시 addEvent 호출
    // addEvent({ title, description, start_date, end_date, source: "manual" });
    alert("일정 추가 폼/모달이 열립니다!");
  }, [isAuthenticated, navigate /*, addEvent*/]);

  // 필터링 (예시: source 기준)
  const filteredEvents =
    selected === "전체"
      ? events
      : events.filter((event) =>
          selected === "개인"
            ? event.source === "manual"
            : event.source ===
              (selected === "공모전"
                ? "contest"
                : selected === "자격증"
                ? "certificate"
                : "codingtest")
        );

  return (
    <div className="flex max-w-6xl mx-auto p-6 gap-6 select-none">
      {/* 좌측: 필터/일정추가 */}
      <aside className="w-52">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
          <AddScheduleButton onClick={handleAddSchedule} />
          <ScheduleFilter
            filters={FILTERS}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      </aside>
      {/* 우측: 캘린더 */}
      <section className="flex-1 min-w-0 bg-white rounded-lg shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          height="auto"
          locale={koLocale}
          headerToolbar={{
            left: "dayGridMonth,timeGridWeek,timeGridDay",
            center: "title",
            right: "today prev,next",
          }}
          events={filteredEvents.map((event) => ({
            id: event.id,
            title: event.title,
            start: event.start_date,
            end: event.end_date,
            // 기타 필드도 필요시 추가
          }))}
        />
      </section>
    </div>
  );
};

export default CalendarPage;
