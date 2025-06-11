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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6 select-none">
          {/* 좌측: 필터/일정추가 */}
          <aside className="w-64">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100/50 p-6 sticky top-6">
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    📅 내 캘린더
                  </h2>
                  <p className="text-sm text-gray-500">일정을 관리해보세요</p>
                </div>
                <AddScheduleButton onClick={handleAddSchedule} />
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                    필터
                  </h3>
                  <ScheduleFilter
                    filters={FILTERS}
                    selected={selected}
                    onSelect={setSelected}
                  />
                </div>
              </div>
            </div>
            {/* 일정 추가 모달 */}
            {modalOpen && (
              <AddScheduleModal onClose={() => setModalOpen(false)} />
            )}
          </aside>

          {/* 우측: 캘린더 */}
          <section className="flex-1 min-w-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100/50 p-6">
              {isLoading ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center gap-3 text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-300 border-t-orange-500"></div>
                    <span className="text-lg">로딩 중...</span>
                  </div>
                </div>
              ) : (
                <div className="calendar-container">
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
                      const ev = events.find(
                        (e) => String(e.id) === info.event.id
                      );
                      setSelectedEvent(ev);
                      setDetailModalOpen(true);
                    }}
                  />
                </div>
              )}
            </div>
          </section>
        </div>

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
      </div>
    </div>
  );
};

export default CalendarPage;
