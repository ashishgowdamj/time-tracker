// Time Zones
export const TIME_ZONES = [
  { id: "Pacific/Honolulu", label: "Hawaii Standard Time (UTC-10:00)" },
  { id: "America/Anchorage", label: "Alaska Standard Time (UTC-09:00)" },
  { id: "America/Los_Angeles", label: "Pacific Time (UTC-08:00)" },
  { id: "America/Denver", label: "Mountain Time (UTC-07:00)" },
  { id: "America/Chicago", label: "Central Time (UTC-06:00)" },
  { id: "America/New_York", label: "Eastern Time (UTC-05:00)" },
  { id: "America/Halifax", label: "Atlantic Time (UTC-04:00)" },
  { id: "America/Sao_Paulo", label: "Brasilia Time (UTC-03:00)" },
  { id: "UTC", label: "Universal Coordinated Time (UTC)" },
  { id: "Europe/London", label: "Greenwich Mean Time (UTC+00:00)" },
  { id: "Europe/Paris", label: "Central European Time (UTC+01:00)" },
  { id: "Europe/Helsinki", label: "Eastern European Time (UTC+02:00)" },
  { id: "Europe/Moscow", label: "Moscow Time (UTC+03:00)" },
  { id: "Asia/Dubai", label: "Gulf Standard Time (UTC+04:00)" },
  { id: "Asia/Karachi", label: "Pakistan Standard Time (UTC+05:00)" },
  { id: "Asia/Dhaka", label: "Bangladesh Standard Time (UTC+06:00)" },
  { id: "Asia/Bangkok", label: "Indochina Time (UTC+07:00)" },
  { id: "Asia/Shanghai", label: "China Standard Time (UTC+08:00)" },
  { id: "Asia/Tokyo", label: "Japan Standard Time (UTC+09:00)" },
  { id: "Australia/Sydney", label: "Australian Eastern Time (UTC+10:00)" },
  { id: "Pacific/Auckland", label: "New Zealand Standard Time (UTC+12:00)" },
];

// Language levels
export const LANGUAGE_LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "elementary", label: "Elementary" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "proficient", label: "Proficient" },
];

// Languages
export const LANGUAGES = [
  { id: "en", name: "English", code: "en" },
  { id: "es", name: "Spanish", code: "es" },
  { id: "fr", name: "French", code: "fr" },
  { id: "de", name: "German", code: "de" },
  { id: "it", name: "Italian", code: "it" },
  { id: "pt", name: "Portuguese", code: "pt" },
  { id: "ru", name: "Russian", code: "ru" },
  { id: "zh", name: "Chinese", code: "zh" },
  { id: "ja", name: "Japanese", code: "ja" },
  { id: "ko", name: "Korean", code: "ko" },
  { id: "ar", name: "Arabic", code: "ar" },
  { id: "hi", name: "Hindi", code: "hi" },
  { id: "tr", name: "Turkish", code: "tr" },
  { id: "nl", name: "Dutch", code: "nl" },
  { id: "sv", name: "Swedish", code: "sv" },
];

// Session status options
export const SESSION_STATUS = [
  { id: "scheduled", label: "Scheduled" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "missed", label: "Missed" },
];

// Chatbot predefined questions and answers
export const CHATBOT_QUESTIONS = [
  {
    question: "How do I change my time zone?",
    answer: "You can change your time zone by going to Settings > Preferences > Time Zone. Select your current time zone from the dropdown menu and save your changes.",
    keywords: ["time zone", "timezone", "change timezone", "update timezone"],
  },
  {
    question: "How do I schedule a new session?",
    answer: "You can schedule a new session by clicking the 'New Session' button on your dashboard or by going to the Schedule page and clicking 'Schedule New Session'. Fill in the session details including title, language, date, and time.",
    keywords: ["schedule", "new session", "create session", "book session"],
  },
  {
    question: "How do I cancel a session?",
    answer: "To cancel a session, go to your Schedule page, find the session you want to cancel, and click the 'Cancel' button. You'll need to confirm your cancellation. Note that some cancellations may be subject to our cancellation policy.",
    keywords: ["cancel", "cancel session", "delete session", "remove session"],
  },
  {
    question: "How do I change my language preferences?",
    answer: "You can update your language preferences by going to the Languages page. There you can add new languages you want to learn, update your proficiency level, or remove languages you're no longer interested in.",
    keywords: ["language", "language preference", "update language", "add language"],
  },
  {
    question: "What happens if I miss a session?",
    answer: "If you miss a scheduled session, it will be marked as 'Missed' in your session history. You can reschedule the session by finding it in your Schedule page and clicking 'Reschedule'. Frequent missed sessions may affect your account status.",
    keywords: ["miss", "missed session", "didn't attend", "absent"],
  },
  {
    question: "How does the time zone converter work?",
    answer: "Our time zone converter automatically converts times between your time zone and your language partner's time zone. Just select both time zones and enter a time in your local time zone, and the converter will show you what time that will be for your partner.",
    keywords: ["converter", "time converter", "time zone converter", "convert time"],
  },
  {
    question: "How do I update my profile?",
    answer: "You can update your profile information by going to the Profile page. There you can change your name, email, profile picture, and other personal information. Don't forget to click 'Save Changes' after making your updates.",
    keywords: ["profile", "update profile", "edit profile", "change profile"],
  },
  {
    question: "Can I get notifications for upcoming sessions?",
    answer: "Yes! We send automatic notifications for upcoming sessions. You'll receive reminders 24 hours before and 15 minutes before each session. You can customize your notification preferences in the Settings page.",
    keywords: ["notification", "reminder", "alert", "upcoming session"],
  },
];

// Initial user data
export const INITIAL_USER = {
  id: 1,
  username: "user1",
  name: "Alex Johnson",
  email: "alex@example.com",
  timeZone: "America/Los_Angeles",
  avatar: "",
  plan: "Premium Plan"
};

// Initial languages data
export const INITIAL_LANGUAGES = [
  {
    id: 1,
    name: "Spanish",
    code: "es",
    level: "Intermediate",
    progress: 65,
    userId: 1
  },
  {
    id: 2,
    name: "French",
    code: "fr",
    level: "Beginner",
    progress: 25,
    userId: 1
  },
  {
    id: 3,
    name: "Japanese",
    code: "ja",
    level: "Beginner",
    progress: 10,
    userId: 1
  }
];

// Initial sessions data
export const INITIAL_SESSIONS = [
  {
    id: 1,
    title: "Spanish Conversation Practice",
    description: "Practice everyday conversational Spanish",
    startTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    languageId: 1,
    userId: 1,
    partnerId: 2,
    partnerName: "Maria Rodriguez",
    partnerTimeZone: "Europe/Madrid",
    status: "scheduled"
  },
  {
    id: 2,
    title: "French Grammar Review",
    description: "Review past tense and common expressions",
    startTime: new Date(new Date().setHours(17, 30, 0, 0)).toISOString(),
    endTime: new Date(new Date().setHours(18, 30, 0, 0)).toISOString(),
    languageId: 2,
    userId: 1,
    partnerId: 3,
    partnerName: "Pierre Dubois",
    partnerTimeZone: "Europe/Paris",
    status: "scheduled"
  },
  {
    id: 3,
    title: "Japanese Beginner Class",
    description: "Learn basic greetings and introductions",
    startTime: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(9, 0, 0, 0);
      return date.toISOString();
    })(),
    endTime: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(10, 0, 0, 0);
      return date.toISOString();
    })(),
    languageId: 3,
    userId: 1,
    partnerId: 4,
    partnerName: "Yuki Tanaka",
    partnerTimeZone: "Asia/Tokyo",
    status: "scheduled"
  }
];

// Stats for dashboard
export const INITIAL_STATS = {
  upcomingSessions: 5,
  activeLanguages: 3,
  hoursPracticed: 32
};
