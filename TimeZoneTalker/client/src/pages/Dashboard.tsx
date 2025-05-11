import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { INITIAL_USER, INITIAL_STATS } from "@/lib/constants";
import UpcomingSessions from "@/components/dashboard/UpcomingSessions";
import TimeZoneConverter from "@/components/dashboard/TimeZoneConverter";
import LanguageProgress from "@/components/dashboard/LanguageProgress";
import CalendarView from "@/components/dashboard/CalendarView";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function Dashboard() {
  // Fetch user data 
  const { data: user } = useQuery({
    queryKey: ["/api/users/current"],
    initialData: INITIAL_USER,
  });

  // Fetch stats data
  const { data: stats } = useQuery({
    queryKey: ["/api/users/stats"],
    initialData: INITIAL_STATS,
  });

  return (
    <div className="p-6">
      {/* Welcome Message */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Welcome back, {user.name.split(" ")[0]}!</h2>
              <p className="text-gray-600">
                You have {stats.upcomingSessions > 0 
                  ? `${stats.upcomingSessions} language sessions scheduled for today.` 
                  : "no language sessions scheduled for today."}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="flex items-center">
                <PlusIcon className="mr-1 h-4 w-4" />
                <span>New Session</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Sessions Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Upcoming Sessions</h3>
                <p className="text-2xl font-semibold">{stats.upcomingSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Languages Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Active Languages</h3>
                <p className="text-2xl font-semibold">{stats.activeLanguages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Hours Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Hours Practiced</h3>
                <p className="text-2xl font-semibold">{stats.hoursPracticed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions & Time Zone Converter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2">
          <UpcomingSessions />
        </div>

        {/* Time Zone Converter */}
        <div>
          <TimeZoneConverter />
        </div>
      </div>

      {/* Language Progress & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Language Progress */}
        <div>
          <LanguageProgress />
        </div>

        {/* Calendar Preview */}
        <div className="lg:col-span-2">
          <CalendarView />
        </div>
      </div>
    </div>
  );
}
