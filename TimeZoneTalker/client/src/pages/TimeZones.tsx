import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { INITIAL_USER, TIME_ZONES } from "@/lib/constants";
import { convertTime, formatTimeWithZone, getTimezoneDifference, formatTimezoneDifference } from "@/lib/utils";
import { Clock, Globe, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TimeZones() {
  const [userTimeZone, setUserTimeZone] = useState<string>("America/Los_Angeles");
  const [partnerTimeZone, setPartnerTimeZone] = useState<string>("Europe/Paris");
  const [userTime, setUserTime] = useState<string>("15:00");
  
  // Calculate partner time based on input time and time zones
  const calculatePartnerTime = () => {
    // Parse the user time
    const [hours, minutes] = userTime.split(":").map(Number);
    const userDate = new Date();
    userDate.setHours(hours, minutes, 0, 0);
    
    // Convert to partner time zone
    const partnerDate = convertTime(userDate, userTimeZone, partnerTimeZone);
    return formatTimeWithZone(partnerDate, partnerTimeZone);
  };
  
  const partnerTime = calculatePartnerTime();
  const hourDiff = getTimezoneDifference(userTimeZone, partnerTimeZone);
  const formattedDiff = formatTimezoneDifference(hourDiff);
  
  // Get time zone label
  const getUserTimeZoneLabel = (id: string) => {
    const zone = TIME_ZONES.find(zone => zone.id === id);
    return zone ? zone.label : id;
  };

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ["/api/users/current"],
    initialData: INITIAL_USER,
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Time Zones</h1>
          <p className="text-gray-500 mt-1">Manage and convert time zones for your sessions</p>
        </div>
      </div>

      <Tabs defaultValue="converter" className="space-y-4">
        <TabsList>
          <TabsTrigger value="converter">Time Zone Converter</TabsTrigger>
          <TabsTrigger value="partners">Partner Time Zones</TabsTrigger>
          <TabsTrigger value="meetings">Meeting Planner</TabsTrigger>
        </TabsList>
        
        <TabsContent value="converter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Time Zone Converter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
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
                
                <div className="space-y-2">
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
                
                <div className="space-y-2">
                  <Label>Your Time</Label>
                  <Input type="time" value={userTime} onChange={(e) => setUserTime(e.target.value)} />
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
                        {formattedDiff}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  World Clock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney"].map((timezone) => (
                    <div key={timezone} className="flex justify-between items-center p-3 border rounded-md">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{getUserTimeZoneLabel(timezone)}</span>
                      </div>
                      <div className="font-medium">
                        {formatTimeWithZone(new Date(), timezone)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="p-3 border rounded-md bg-primary-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                      <span className="font-medium">Your Time Zone</span>
                    </div>
                    <div className="font-medium text-primary-600">
                      {formatTimeWithZone(new Date(), user.timeZone)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="partners">
          <Card>
            <CardHeader>
              <CardTitle>Partner Time Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">Maria Rodriguez</p>
                    <p className="text-sm text-gray-500">Spanish Conversation Partner</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatTimeWithZone(new Date(), "Europe/Madrid")}</p>
                    <p className="text-sm text-gray-500">Europe/Madrid</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">Pierre Dubois</p>
                    <p className="text-sm text-gray-500">French Grammar Tutor</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatTimeWithZone(new Date(), "Europe/Paris")}</p>
                    <p className="text-sm text-gray-500">Europe/Paris</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">Yuki Tanaka</p>
                    <p className="text-sm text-gray-500">Japanese Instructor</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatTimeWithZone(new Date(), "Asia/Tokyo")}</p>
                    <p className="text-sm text-gray-500">Asia/Tokyo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Planner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">Find the best time to schedule sessions across different time zones.</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Participants</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select participants" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Partners</SelectItem>
                        <SelectItem value="maria">Maria Rodriguez</SelectItem>
                        <SelectItem value="pierre">Pierre Dubois</SelectItem>
                        <SelectItem value="yuki">Yuki Tanaka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="p-4 text-center text-gray-500 border border-dashed rounded-md">
                  Select a date and participants to see available meeting times
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
