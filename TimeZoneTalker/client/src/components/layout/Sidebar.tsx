import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { INITIAL_USER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Clock,
  Globe,
  Settings,
  User,
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  
  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ["/api/users/current"],
    initialData: INITIAL_USER,
  });

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Time Zones", href: "/timezone", icon: Clock },
    { name: "Languages", href: "/language", icon: Globe },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard" && (location === "/" || location === "/dashboard")) {
      return true;
    }
    return location === path;
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <h1 className="text-xl font-bold text-primary-600">LinguaSync</h1>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <a
                  className={cn(
                    "flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100",
                    isActive(item.href) && "text-primary-500 bg-primary-50"
                  )}
                >
                  <item.icon className="text-xl mr-3 h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.plan}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
