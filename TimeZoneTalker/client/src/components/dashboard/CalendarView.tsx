import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { INITIAL_SESSIONS } from "@/lib/constants";
import { PlusIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from "date-fns";

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Fetch sessions data
  const { data: sessions } = useQuery({
    queryKey: ["/api/sessions"],
    initialData: INITIAL_SESSIONS,
  });

  // Navigation functions
  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Calendar rendering helpers
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-center font-medium">{format(currentMonth, "MMMM yyyy")}</h3>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {days.map((day, i) => (
          <div key={i} className="text-xs text-gray-500">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    // Check if a day has a session
    const hasSession = (day: Date) => {
      return sessions.some(session => {
        const sessionDate = parseISO(session.startTime);
        return isSameDay(day, sessionDate);
      });
    };

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const formattedDate = format(day, "d");
        const hasDaySession = hasSession(day);
        
        days.push(
          <div
            key={day.toString()}
            className={`p-2 text-center ${
              !isCurrentMonth ? "text-gray-400" : ""
            } ${hasDaySession ? "relative" : ""}`}
          >
            {formattedDate}
            {hasDaySession && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1 text-center">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <Card>
      <CardHeader className="p-6 border-b border-gray-200 flex justify-between items-center">
        <CardTitle className="text-lg">Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button className="w-full flex items-center justify-center">
            <PlusIcon className="h-4 w-4 mr-2" />
            <span>Schedule New Session</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
