import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TIME_ZONES } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { INITIAL_USER } from "@/lib/constants";

export default function Settings() {
  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ["/api/users/current"],
    initialData: INITIAL_USER,
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account preferences</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Time Zone</h3>
                <p className="text-sm text-gray-500">Choose your local time zone for accurate scheduling</p>
                <Separator className="my-2" />
                <div className="max-w-md">
                  <Select defaultValue={user.timeZone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time zone" />
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
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Language Preferences</h3>
                <p className="text-sm text-gray-500">Set your application display language</p>
                <Separator className="my-2" />
                <div className="max-w-md">
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Calendar Integration</h3>
                <p className="text-sm text-gray-500">Connect your calendar to manage sessions</p>
                <Separator className="my-2" />
                <div className="flex flex-col space-y-4">
                  <Button variant="outline" className="w-fit">
                    Connect Google Calendar
                  </Button>
                  <Button variant="outline" className="w-fit">
                    Connect Outlook Calendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <Separator className="my-2" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Session Reminders</Label>
                        <p className="text-sm text-gray-500">Receive email reminders before sessions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">New Messages</Label>
                        <p className="text-sm text-gray-500">Get notified when you receive new messages</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Schedule Changes</Label>
                        <p className="text-sm text-gray-500">Get notified when your sessions are rescheduled</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Marketing</Label>
                        <p className="text-sm text-gray-500">Receive news and promotional offers</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Push Notifications</h3>
                  <Separator className="my-2" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Session Alerts</Label>
                        <p className="text-sm text-gray-500">Get alerts before your sessions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Messages</Label>
                        <p className="text-sm text-gray-500">Get notified about new messages</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Theme</h3>
                  <Separator className="my-2" />
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="flex-1 max-w-[120px] flex-col h-20 p-2">
                      <div className="h-10 w-full bg-white border rounded-sm mb-1"></div>
                      <span className="text-xs">Light</span>
                    </Button>
                    <Button variant="outline" className="flex-1 max-w-[120px] flex-col h-20 p-2">
                      <div className="h-10 w-full bg-gray-900 border rounded-sm mb-1"></div>
                      <span className="text-xs">Dark</span>
                    </Button>
                    <Button variant="outline" className="flex-1 max-w-[120px] flex-col h-20 p-2">
                      <div className="h-10 w-full bg-gradient-to-b from-white to-gray-900 border rounded-sm mb-1"></div>
                      <span className="text-xs">System</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Display Options</h3>
                  <Separator className="my-2" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">24-hour Time</Label>
                        <p className="text-sm text-gray-500">Use 24-hour format for time display</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Reduce Motion</Label>
                        <p className="text-sm text-gray-500">Minimize animations throughout the app</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Profile Visibility</h3>
                  <Separator className="my-2" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Public Profile</Label>
                        <p className="text-sm text-gray-500">Allow other users to find your profile</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Show Online Status</Label>
                        <p className="text-sm text-gray-500">Let others see when you're online</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Data Settings</h3>
                  <Separator className="my-2" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Allow Usage Data</Label>
                        <p className="text-sm text-gray-500">Help improve our app through anonymous usage data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Personalized Recommendations</Label>
                        <p className="text-sm text-gray-500">Receive tailored language learning suggestions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="destructive" className="w-fit">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
