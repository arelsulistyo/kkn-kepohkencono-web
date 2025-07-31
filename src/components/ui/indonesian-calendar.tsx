"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./indonesian-calendar.css";

interface IndonesianCalendarProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  className?: string;
}

const IndonesianCalendar = ({ value, onChange, className }: IndonesianCalendarProps) => {
  return (
    <Calendar
      value={value}
      onChange={(value: any) => {
        if (value instanceof Date) {
          onChange(value);
        } else {
          onChange(undefined);
        }
      }}
      className={`border-0 ${className || ""}`}
      locale="id-ID"
      formatShortWeekday={(locale, date) => {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        return days[date.getDay()];
      }}
      formatMonth={(locale, date) => {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months[date.getMonth()];
      }}
    />
  );
};

export default IndonesianCalendar;
export type { IndonesianCalendarProps };