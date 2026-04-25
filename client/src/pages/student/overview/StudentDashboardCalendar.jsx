import { useState } from "react";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
} from "date-fns";
import { Card } from "@/components/ui/card";

const fetchLogsForMonth = async (year, month) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const rand = Math.random();
    if (rand < 0.6) return "entered";
    if (rand < 0.8) return "missed";
    return null;
  });
};

const StudentDashboardCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: "" });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data: logs, isLoading } = useQuery({
    queryKey: ["logs", year, month],
    queryFn: () => fetchLogsForMonth(year, month),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const handleMouseEnter = (event, day, status) => {
    setTooltip({
      show: true,
      x: event.clientX,
      y: event.clientY,
      text: `${format(day, "EEEE, MMMM d, yyyy")} - ${status ?? "No log"}`,
    });
  };

  const handleMouseMove = (event) => {
    setTooltip((prev) => ({ ...prev, x: event.clientX, y: event.clientY }));
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, show: false }));
  };

  return (
    <section className="flex flex-col gap-2">
      <h2>Log Entries</h2>
      <Card className="p-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded hover:bg-gray-200">
            <Icon icon="mdi:chevron-left" width={24} height={24} />
          </button>

          <h2 className="text-lg font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>

          <button onClick={nextMonth} className="p-2 rounded hover:bg-gray-200">
            <Icon icon="mdi:chevron-right" width={24} height={24} />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 text-center text-sm font-medium mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="p-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const dayOfMonth = day.getDate();
            const inMonth = isSameMonth(day, monthStart);
            const isSunday = day.getDay() === 0;
            const logStatus =
              inMonth && !isSunday ? logs?.[dayOfMonth - 1] : null;

            const indicatorColor =
              logStatus === "entered"
                ? "bg-green-500"
                : logStatus === "missed"
                  ? "bg-red-300"
                  : "bg-gray-300";

            return (
              <div
                key={idx}
                className={`relative h-16 flex flex-col items-center justify-center border rounded-lg ${
                  !inMonth ? "opacity-50" : ""
                } ${isSunday ? "bg-primary/40" : ""}`}
                onMouseEnter={(e) => handleMouseEnter(e, day, logStatus)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <span className="text-sm">{dayOfMonth}</span>
                {!isSunday && inMonth && (
                  <div
                    className={`w-6 h-2 rounded-full mt-1 ${indicatorColor} transition-colors`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <span className="text-gray-500">Loading logs...</span>
          </div>
        )}
      </Card>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-50 px-2 py-1 text-sm text-white bg-[#045DA0] rounded-2xl shadow-lg pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 30,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </section>
  );
};

export default StudentDashboardCalendar;
