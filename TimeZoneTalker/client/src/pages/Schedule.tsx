import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { INITIAL_SESSIONS } from "@/lib/constants";
import SessionCard from "@/components/common/SessionCard";
import { PlusIcon, ListFilter, CalendarIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"list" | "calendar">("list");

  // Fetch sessions data
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/sessions"],
    initialData: INITIAL_SESSIONS,
  });

  // Filter sessions by selected date if in calendar view
  const filteredSessions = selectedDate
    ? sessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        return (
          sessionDate.getDate() === selectedDate.getDate() &&
          sessionDate.getMonth() === selectedDate.getMonth() &&
          sessionDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : sessions;

  const handleCalendarSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Get dates that have sessions for highlighting in calendar
  const sessionDates = sessions.map(session => new Date(session.startTime));

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="text-gray-500 mt-1">Manage your language learning sessions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="flex items-center">
            <PlusIcon className="mr-1 h-4 w-4" />
            <span>New Session</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="mb-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          <div className="flex justify-end mb-4">
            <div className="flex space-x-2">
              <Button 
                variant={view === "list" ? "default" : "outline"} 
                size="sm"
                onClick={() => setView("list")}
              >
                <ListFilter className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button 
                variant={view === "calendar" ? "default" : "outline"} 
                size="sm"
                onClick={() => setView("calendar")}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Calendar
              </Button>
            </div>
          </div>

          {view === "calendar" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleCalendarSelect}
                    className="rounded-md"
                  />
                </CardContent>
              </Card>
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Sessions for {selectedDate ? formatDate(selectedDate, "PPP") : "Today"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="py-8 text-center">Loading sessions...</div>
                    ) : filteredSessions.length > 0 ? (
                      <div className="space-y-4">
                        {filteredSessions.map((session) => (
                          <SessionCard key={session.id} session={session} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-gray-500">
                        No sessions scheduled for this date
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-8 text-center">Loading sessions...</div>
              ) : sessions.length > 0 ? (
                sessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No upcoming sessions found
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-4">
          <div className="py-8 text-center text-gray-500">
            No past sessions found
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-8 text-center">Loading sessions...</div>
            ) : sessions.length > 0 ? (
              sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                No sessions found
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
