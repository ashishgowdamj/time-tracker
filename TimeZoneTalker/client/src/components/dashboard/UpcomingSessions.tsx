import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { INITIAL_SESSIONS } from "@/lib/constants";
import SessionCard from "@/components/common/SessionCard";

export default function UpcomingSessions() {
  // Fetch sessions data
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/sessions"],
    initialData: INITIAL_SESSIONS,
  });

  // Sort sessions by start time (earliest first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <Card>
      <CardHeader className="p-6 border-b border-gray-200">
        <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sortedSessions.length > 0 ? (
          <div className="space-y-6">
            {sortedSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No upcoming sessions found</p>
            <Button variant="outline" className="mt-4">
              Schedule a Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
