import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CHATBOT_QUESTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquareText, X } from "lucide-react";
import { useChatbot } from "@/hooks/useChatbot";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getResponse } = useChatbot();
  
  // Fetch chatbot questions data
  const { data: chatbotQuestions } = useQuery({
    queryKey: ["/api/chatbot/questions"],
    initialData: CHATBOT_QUESTIONS,
  });
  
  // Initialize with welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "bot",
      text: "👋 Hi there! I'm your language learning assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      text: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // Get response from chatbot
    setTimeout(() => {
      const response = getResponse(input.trim(), chatbotQuestions);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  return (
    <div className="fixed right-6 bottom-6 md:bottom-6 z-30 flex flex-col items-end">
      {/* Collapsed State */}
      <Button
        onClick={toggleChatbot}
        className="bg-primary-500 hover:bg-primary-600 text-white p-4 h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
        aria-label="Open chat support"
      >
        <MessageSquareText className="h-6 w-6" />
      </Button>
      
      {/* Expanded State */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: "400px" }}>
          <div className="bg-primary-500 text-white p-4 flex justify-between items-center chatbot-shadow">
            <div className="flex items-center">
              <MessageSquareText className="h-5 w-5 mr-2" />
              <h3 className="font-medium">Language Support</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChatbot} className="h-8 w-8 text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto scrollbar-hide" id="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`flex mb-4 ${message.type === "user" ? "justify-end" : ""}`}>
                <div className={`py-2 px-3 max-w-[80%] rounded-lg ${
                  message.type === "user" 
                    ? "bg-primary-100 text-primary-800" 
                    : "bg-gray-100"
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 flex items-center">
            <Input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white rounded-r-md py-2 px-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
