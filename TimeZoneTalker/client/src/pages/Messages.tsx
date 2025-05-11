import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Messages() {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-gray-500 mt-1">Chat with language partners and instructors</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="flex items-center">
            <PlusIcon className="mr-1 h-4 w-4" />
            <span>New Conversation</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversation List */}
        <Card className="md:col-span-1">
          <CardHeader className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {/* Conversation items would map here */}
              <div className="p-4 hover:bg-muted/50 cursor-pointer bg-primary-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <div className="text-gray-400 font-medium">MR</div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-baseline">
                      <p className="font-medium text-sm">Maria Rodriguez</p>
                      <span className="text-xs text-gray-500">10:30 AM</span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">Would 4pm your time work for our session?</p>
                  </div>
                </div>
              </div>
              <div className="p-4 hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <div className="text-gray-400 font-medium">PD</div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-baseline">
                      <p className="font-medium text-sm">Pierre Dubois</p>
                      <span className="text-xs text-gray-500">Yesterday</span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">Thanks for the session today! I learned a lot.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <div className="text-gray-400 font-medium">YT</div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-baseline">
                      <p className="font-medium text-sm">Yuki Tanaka</p>
                      <span className="text-xs text-gray-500">Oct 5</span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">Looking forward to our Japanese lesson tomorrow!</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2">
          <CardHeader className="px-6 py-4 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <div className="text-gray-400 font-medium">MR</div>
              </div>
              <div className="ml-3">
                <CardTitle className="text-base">Maria Rodriguez</CardTitle>
                <p className="text-xs text-gray-500">Spanish Conversation Partner</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] flex flex-col justify-between">
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <div className="flex">
                  <div className="bg-gray-100 rounded-lg py-2 px-3 max-w-[80%]">
                    <p className="text-sm">Hola Alex! How are you today?</p>
                    <span className="text-xs text-gray-500 mt-1 block">9:30 AM</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-primary-100 text-primary-800 rounded-lg py-2 px-3 max-w-[80%]">
                    <p className="text-sm">¡Hola Maria! I'm doing well, thanks. How about you?</p>
                    <span className="text-xs text-gray-500 mt-1 block">9:32 AM</span>
                  </div>
                </div>

                <div className="flex">
                  <div className="bg-gray-100 rounded-lg py-2 px-3 max-w-[80%]">
                    <p className="text-sm">Muy bien, gracias! I was wondering if we could reschedule our session today?</p>
                    <span className="text-xs text-gray-500 mt-1 block">9:35 AM</span>
                  </div>
                </div>

                <div className="flex">
                  <div className="bg-gray-100 rounded-lg py-2 px-3 max-w-[80%]">
                    <p className="text-sm">Would 4pm your time work instead of 3pm?</p>
                    <span className="text-xs text-gray-500 mt-1 block">9:36 AM</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-primary-100 text-primary-800 rounded-lg py-2 px-3 max-w-[80%]">
                    <p className="text-sm">Let me check my schedule...</p>
                    <span className="text-xs text-gray-500 mt-1 block">10:30 AM</span>
                  </div>
                </div>
              </div>

              <div className="border-t p-4">
                <div className="flex items-center">
                  <Input placeholder="Type your message..." className="flex-1" />
                  <Button className="ml-2" size="sm">Send</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
