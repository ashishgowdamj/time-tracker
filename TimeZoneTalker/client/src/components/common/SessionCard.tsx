import { Button } from "@/components/ui/button";
import { 
  formatTimeWithZone, 
  getRelativeDayLabel, 
  getTimeRange 
} from "@/lib/utils";
import { Session } from "@shared/schema";
import { Clock, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { INITIAL_USER } from "@/lib/constants";

interface SessionCardProps {
  session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
  // Fetch user data to get user's time zone
  const { data: user } = useQuery({
    queryKey: ["/api/users/current"],
    initialData: INITIAL_USER,
  });

  // Get day label (Today, Tomorrow, or date)
  const dayLabel = getRelativeDayLabel(session.startTime);
  
  // Format time range in user's timezone
  const timeRange = getTimeRange(session.startTime, session.endTime, user.timeZone);

  // Determine if session is active (can be joined)
  const now = new Date();
  const sessionStart = new Date(session.startTime);
  const sessionEnd = new Date(session.endTime);
  const canJoin = now >= new Date(sessionStart.getTime() - 10 * 60 * 1000) && now <= sessionEnd;

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{session.title}</h3>
        <span className="text-sm text-gray-500">{dayLabel}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <Clock className="mr-2 h-4 w-4" />
        <span>{timeRange} (Your time)</span>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-3">
        <User className="mr-2 h-4 w-4" />
        <span>with {session.partnerName || "No partner assigned"}</span>
      </div>
      <div className="flex space-x-2">
        <Button 
          size="sm"
          disabled={!canJoin}
          className={!canJoin ? "bg-gray-200 text-gray-700 cursor-not-allowed" : ""}
        >
          Join
        </Button>
        <Button 
          variant="outline" 
          size="sm"
        >
          Reschedule
        </Button>
      </div>
    </div>
  );
}
