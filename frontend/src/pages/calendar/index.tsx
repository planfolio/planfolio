import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import koLocale from "@fullcalendar/core/locales/ko";
import AddScheduleButton from "../../components/Calendar/AddScheduleButton";
import ScheduleFilter from "../../components/Calendar/ScheduleFilter";
import "../../styles/FullCalendar.css";

const FILTERS = ["전체", "공모전", "자격증", "코딩테스트", "개인"];

const CalendarPage: React.FC = () => {
  const [selected, setSelected] = useState<string>("전체");

  const handleAddSchedule = () => {
    alert("일정 추가 폼/모달이 열립니다!");
    // 실제로는 모달 상태를 true로 바꾸고, 모달 컴포넌트 띄우기
  };

  return (
    <div className="flex max-w-6xl mx-auto p-6 gap-6">
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
        />
      </section>
    </div>
  );
};

export default CalendarPage;
