import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "../../styles/FullCalendar.css";
import koLocale from "@fullcalendar/core/locales/ko";

const Calendar: React.FC = () => {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        locale={koLocale}
      />
    </div>
  );
};

export default Calendar;
