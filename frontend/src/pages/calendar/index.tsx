import React, { useEffect, useCallback, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import koLocale from "@fullcalendar/core/locales/ko";
import AddScheduleButton from "../../components/Calendar/AddScheduleButton";
import AddScheduleModal from "../../components/Modal/AddScheduleModal";
import ScheduleDetailModal from "../../components/Modal/ScheduleDetailModal";
import EditScheduleModal from "../../components/Modal/EditScehduleModal";
import ScheduleFilter from "../../components/Calendar/ScheduleFilter";
import "../../styles/FullCalendar.css";
import { useNavigate } from "react-router-dom";
import { useCalendarStore } from "../../store/useCalendarStore";
import { useAuthStore } from "../../store/useAuthStore";

const FILTERS = ["전체", "공모전", "자격증", "코딩테스트", "개인"];

const CalendarPage: React.FC = () => {
  const { events, isLoading, fetchEvents, deleteEvent } = useCalendarStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [selected, setSelected] = useState("전체");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated, fetchEvents]);

  const handleAddSchedule = useCallback(() => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다!");
      navigate("/login");
      return;
    }
    setModalOpen(true);
  }, [isAuthenticated, navigate]);

  // 삭제 핸들러
  const handleDelete = async () => {
    if (selectedEvent && window.confirm("정말 일정을 삭제하시겠습니까?")) {
      await deleteEvent(selectedEvent.id);
      setDetailModalOpen(false);
    }
  };

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
        {/* 일정 추가 모달 */}
        {modalOpen && <AddScheduleModal onClose={() => setModalOpen(false)} />}
      </aside>
      {/* 우측: 캘린더 */}
      <section className="flex-1 min-w-0 bg-white rounded-lg shadow p-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : (
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
              id: String(event.id),
              title: event.title,
              start: event.start_date,
              end: event.end_date,
            }))}
            eventClick={(info) => {
              const ev = events.find((e) => String(e.id) === info.event.id);
              setSelectedEvent(ev);
              setDetailModalOpen(true);
            }}
          />
        )}
        {/* 일정 상세 모달 */}
        {detailModalOpen && selectedEvent && (
          <ScheduleDetailModal
            event={selectedEvent}
            onClose={() => setDetailModalOpen(false)}
            onEdit={() => {
              setDetailModalOpen(false);
              setEditModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}
        {/* 일정 수정 모달 */}
        {editModalOpen && selectedEvent && (
          <EditScheduleModal
            event={selectedEvent}
            onClose={() => setEditModalOpen(false)}
          />
        )}
      </section>
    </div>
  );
};

export default CalendarPage;
