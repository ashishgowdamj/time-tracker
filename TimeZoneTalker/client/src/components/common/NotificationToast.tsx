import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface NotificationToastProps {
  title: string;
  message: string;
  onClose: () => void;
}

export default function NotificationToast({ 
  title, 
  message, 
  onClose 
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Handle closing the notification
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed top-6 right-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 transform transition-transform duration-300 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 text-primary-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
          <div className="mt-2 flex space-x-2">
            <Button size="sm" className="text-xs">
              Join Now
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-gray-500" onClick={handleClose}>
              Dismiss
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="ml-4 flex-shrink-0 text-gray-400" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
