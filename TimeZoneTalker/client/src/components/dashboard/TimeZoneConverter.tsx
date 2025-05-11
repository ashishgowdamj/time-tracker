import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TIME_ZONES } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { INITIAL_USER } from "@/lib/constants";
import { convertTime, formatTimeWithZone, getTimezoneDifference, formatTimezoneDifference } from "@/lib/utils";
import { Clock } from "lucide-react";

export default function TimeZoneConverter() {
  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ["/api/users/current"],
    initialData: INITIAL_USER,
  });

  // Initialize state
  const [userTimeZone, setUserTimeZone] = useState<string>(user.timeZone);
  const [partnerTimeZone, setPartnerTimeZone] = useState<string>("Europe/Paris");
  const [userTime, setUserTime] = useState<string>("15:00");
  const [partnerTime, setPartnerTime] = useState<string>("");
  const [hourDiff, setHourDiff] = useState<number>(0);

  // Effect to update partner time when inputs change
  useEffect(() => {
    calculatePartnerTime();
    calculateTimeDifference();
  }, [userTimeZone, partnerTimeZone, userTime]);

  // Calculate partner time based on input time and time zones
  const calculatePartnerTime = () => {
    // Parse the user time
    const [hours, minutes] = userTime.split(":").map(Number);
    const userDate = new Date();
    userDate.setHours(hours, minutes, 0, 0);
    
    // Convert to partner time zone
    const partnerDate = convertTime(userDate, userTimeZone, partnerTimeZone);
    setPartnerTime(formatTimeWithZone(partnerDate, partnerTimeZone));
  };
  
  // Calculate difference between time zones
  const calculateTimeDifference = () => {
    const diff = getTimezoneDifference(userTimeZone, partnerTimeZone);
    setHourDiff(diff);
  };

  return (
    <Card>
      <CardHeader className="p-6 border-b border-gray-200">
        <CardTitle className="text-lg">Time Zone Converter</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Your Time Zone</Label>
            <Select value={userTimeZone} onValueChange={setUserTimeZone}>
              <SelectTrigger>
                <SelectValue placeholder="Select your time zone" />
              </SelectTrigger>
              <SelectContent>
                {TIME_ZONES.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label>Partner's Time Zone</Label>
            <Select value={partnerTimeZone} onValueChange={setPartnerTimeZone}>
              <SelectTrigger>
                <SelectValue placeholder="Select partner's time zone" />
              </SelectTrigger>
              <SelectContent>
                {TIME_ZONES.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label>Your Time</Label>
            <Input 
              type="time" 
              value={userTime} 
              onChange={(e) => setUserTime(e.target.value)} 
            />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Partner's Time:</h3>
                <p className="text-xl font-semibold text-primary-600">{partnerTime}</p>
              </div>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTimezoneDifference(hourDiff)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
