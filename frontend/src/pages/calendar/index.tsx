import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import koLocale from "@fullcalendar/core/locales/ko";
import { useCalendarStore } from "../../store/useCalendarStore";
import { useAuthStore } from "../../store/useAuthStore";
import AddScheduleModal from "../../components/Modal/AddScheduleModal";
import EditScheduleModal from "../../components/Modal/EditScheduleModel";
import "../../styles/FullCalendar.css";

const FILTERS = ["전체", "공모전", "자격증", "코딩테스트", "개인"];

const CalendarPage: React.FC = () => {
  const { events, isLoading, error, fetchEvents } = useCalendarStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [selected, setSelected] = useState("전체");
  const [modalOpen, setModalOpen] = useState(false);

  // 수정 모달 상태
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated, fetchEvents]);

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
    <div className="flex max-w-6xl mx-auto py-10 px-4 gap-10 select-none">
      {/* 사이드바 */}
      <aside className="w-56">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 flex flex-col gap-8 border border-gray-100">
          <button
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-pink-400 text-white font-bold text-lg shadow hover:scale-105 transition"
            onClick={() => setModalOpen(true)}
            disabled={!isAuthenticated}
            title={isAuthenticated ? "" : "로그인 후 일정 추가가 가능합니다"}
          >
            + 일정 추가
          </button>
          {/* 필터 */}
          <div>
            <div className="text-gray-700 font-bold mb-3 tracking-tight">
              일정 유형
            </div>
            <div className="flex flex-col gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelected(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition border text-left
                    ${
                      selected === filter
                        ? "bg-gradient-to-r from-orange-500 to-pink-400 text-white shadow border-transparent"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-orange-50"
                    }`}
                  aria-pressed={selected === filter}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* 일정 추가 모달 */}
        {modalOpen && <AddScheduleModal onClose={() => setModalOpen(false)} />}
      </aside>
      {/* 캘린더 */}
      <section className="flex-1 min-w-0 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-orange-100 p-8 flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-orange-500 tracking-tight">
            나의 캘린더
          </h2>
        </div>
        {/* 로그인 필요 안내 배너 */}
        {!isAuthenticated && (
          <div className="mb-6 flex items-center justify-center bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 text-orange-500 font-semibold rounded-xl py-4 px-6 shadow">
            캘린더의 일정을 보거나 추가하려면{" "}
            <span className="mx-1 font-bold">로그인/회원가입</span>이
            필요합니다.
          </div>
        )}
        {/* 로딩 중일 때 */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full border-4 border-orange-400 border-t-transparent animate-spin shadow-lg" />
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-lg font-bold tracking-tight">
                캘린더를 불러오는 중입니다
              </span>
              <svg
                className="w-5 h-5 text-orange-400 animate-pulse"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                <path
                  d="M12 6v6l4 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-gray-400 text-sm">
              잠시만 기다려 주세요...
            </span>
          </div>
        ) : (
          <div className="flex-1">
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
              events={
                isAuthenticated
                  ? filteredEvents.map((event, idx) => ({
                      id:
                        event.id || `${event.title}-${event.start_date}-${idx}`,
                      title: event.title,
                      start:
                        event.start_date.length === 10
                          ? `${event.start_date}T00:00:00`
                          : event.start_date,
                      end:
                        event.end_date.length === 10
                          ? `${event.end_date}T23:59:59`
                          : event.end_date,
                      allDay: true,
                      color: event.color || "#f97316",
                      ...event,
                    }))
                  : []
              }
              eventClick={(info) => {
                const ev = filteredEvents.find((e, idx) =>
                  e.id
                    ? e.id === info.event.id
                    : `${e.title}-${e.start_date}-${idx}` === info.event.id
                );
                setSelectedEvent(ev);
                setEditModalOpen(true);
              }}
              dayMaxEventRows={2}
              eventDisplay="block"
              eventColor="#f97316"
              eventTextColor="#fff"
            />
            {/* 일정 수정 모달 */}
            {editModalOpen && selectedEvent && (
              <EditScheduleModal
                event={selectedEvent}
                onClose={() => setEditModalOpen(false)}
              />
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default CalendarPage;
