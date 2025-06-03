import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "../../styles/FullCalendar.css";

const Calendar: React.FC = () => {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
      />
    </div>
  );
};

export default Calendar;
