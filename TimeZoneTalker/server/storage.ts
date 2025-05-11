import { 
  users, 
  languages, 
  sessions, 
  chatbotQuestions, 
  notifications, 
  type User, 
  type InsertUser, 
  type Language, 
  type InsertLanguage, 
  type Session, 
  type InsertSession, 
  type ChatbotQuestion, 
  type InsertChatbotQuestion, 
  type Notification, 
  type InsertNotification 
} from "@shared/schema";
import { INITIAL_USER, INITIAL_LANGUAGES, INITIAL_SESSIONS, INITIAL_STATS, CHATBOT_QUESTIONS } from "@/lib/constants";

// Interface for storage methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  getUserStats(id: number): Promise<any>;

  // Language methods
  getLanguagesForUser(userId: number): Promise<Language[]>;
  getLanguage(id: number): Promise<Language | undefined>;
  createLanguage(language: InsertLanguage): Promise<Language>;
  updateLanguage(id: number, language: Partial<InsertLanguage>): Promise<Language | undefined>;
  deleteLanguage(id: number): Promise<void>;

  // Session methods
  getSessionsForUser(userId: number): Promise<Session[]>;
  getSession(id: number): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: number, session: Partial<InsertSession>): Promise<Session | undefined>;
  deleteSession(id: number): Promise<void>;

  // Chatbot methods
  getChatbotQuestions(): Promise<ChatbotQuestion[]>;
  getChatbotQuestion(id: number): Promise<ChatbotQuestion | undefined>;
  createChatbotQuestion(question: InsertChatbotQuestion): Promise<ChatbotQuestion>;
  findChatbotResponse(query: string): Promise<ChatbotQuestion | undefined>;

  // Notification methods
  getNotificationsForUser(userId: number): Promise<Notification[]>;
  getNotification(id: number): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private languages: Map<number, Language>;
  private sessions: Map<number, Session>;
  private chatbotQuestions: Map<number, ChatbotQuestion>;
  private notifications: Map<number, Notification>;
  
  private userIdCounter: number;
  private languageIdCounter: number;
  private sessionIdCounter: number;
  private chatbotQuestionIdCounter: number;
  private notificationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.languages = new Map();
    this.sessions = new Map();
    this.chatbotQuestions = new Map();
    this.notifications = new Map();
    
    this.userIdCounter = 1;
    this.languageIdCounter = 1;
    this.sessionIdCounter = 1;
    this.chatbotQuestionIdCounter = 1;
    this.notificationIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add initial user
    this.users.set(INITIAL_USER.id, INITIAL_USER);
    this.userIdCounter = INITIAL_USER.id + 1;

    // Add initial languages
    for (const language of INITIAL_LANGUAGES) {
      this.languages.set(language.id, language);
      if (language.id >= this.languageIdCounter) {
        this.languageIdCounter = language.id + 1;
      }
    }

    // Add initial sessions
    for (const session of INITIAL_SESSIONS) {
      this.sessions.set(session.id, session);
      if (session.id >= this.sessionIdCounter) {
        this.sessionIdCounter = session.id + 1;
      }
    }

    // Add initial chatbot questions
    for (const [index, question] of CHATBOT_QUESTIONS.entries()) {
      const id = index + 1;
      this.chatbotQuestions.set(id, { id, ...question });
      this.chatbotQuestionIdCounter = id + 1;
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = {
      ...user,
      id,
      timeZone: user.timeZone || "UTC",
      plan: user.plan || "Free",
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser: User = {
      ...user,
      ...userData,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserStats(userId: number): Promise<any> {
    // Count upcoming sessions
    const upcomingSessions = Array.from(this.sessions.values()).filter(
      session => session.userId === userId && session.status === "scheduled"
    ).length;
    
    // Count active languages
    const activeLanguages = Array.from(this.languages.values()).filter(
      language => language.userId === userId
    ).length;
    
    // In a real app, hours practiced would be calculated from completed sessions
    // For demo purposes, return static data
    return {
      upcomingSessions,
      activeLanguages,
      hoursPracticed: INITIAL_STATS.hoursPracticed,
    };
  }

  // Language methods
  async getLanguagesForUser(userId: number): Promise<Language[]> {
    return Array.from(this.languages.values()).filter(
      language => language.userId === userId
    );
  }

  async getLanguage(id: number): Promise<Language | undefined> {
    return this.languages.get(id);
  }

  async createLanguage(language: InsertLanguage): Promise<Language> {
    const id = this.languageIdCounter++;
    const newLanguage: Language = {
      ...language,
      id,
      progress: language.progress || 0,
    };
    this.languages.set(id, newLanguage);
    return newLanguage;
  }

  async updateLanguage(id: number, languageData: Partial<InsertLanguage>): Promise<Language | undefined> {
    const language = this.languages.get(id);
    if (!language) {
      return undefined;
    }
    
    const updatedLanguage: Language = {
      ...language,
      ...languageData,
    };
    this.languages.set(id, updatedLanguage);
    return updatedLanguage;
  }

  async deleteLanguage(id: number): Promise<void> {
    this.languages.delete(id);
  }

  // Session methods
  async getSessionsForUser(userId: number): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      session => session.userId === userId
    );
  }

  async getSession(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async createSession(session: InsertSession): Promise<Session> {
    const id = this.sessionIdCounter++;
    const newSession: Session = {
      ...session,
      id,
    };
    this.sessions.set(id, newSession);
    return newSession;
  }

  async updateSession(id: number, sessionData: Partial<InsertSession>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) {
      return undefined;
    }
    
    const updatedSession: Session = {
      ...session,
      ...sessionData,
    };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteSession(id: number): Promise<void> {
    this.sessions.delete(id);
  }

  // Chatbot methods
  async getChatbotQuestions(): Promise<ChatbotQuestion[]> {
    return Array.from(this.chatbotQuestions.values());
  }

  async getChatbotQuestion(id: number): Promise<ChatbotQuestion | undefined> {
    return this.chatbotQuestions.get(id);
  }

  async createChatbotQuestion(question: InsertChatbotQuestion): Promise<ChatbotQuestion> {
    const id = this.chatbotQuestionIdCounter++;
    const newQuestion: ChatbotQuestion = {
      ...question,
      id,
    };
    this.chatbotQuestions.set(id, newQuestion);
    return newQuestion;
  }

  async findChatbotResponse(query: string): Promise<ChatbotQuestion | undefined> {
    const questions = Array.from(this.chatbotQuestions.values());
    const queryLower = query.toLowerCase();
    
    // First, try exact question matches
    for (const q of questions) {
      if (queryLower === q.question.toLowerCase()) {
        return q;
      }
    }
    
    // Then, try keyword matching
    let bestMatch: ChatbotQuestion | undefined = undefined;
    let highestScore = 0;
    
    for (const q of questions) {
      let matchScore = 0;
      
      // Check each keyword
      for (const keyword of q.keywords) {
        if (queryLower.includes(keyword.toLowerCase())) {
          // Add points based on the specificity of the match
          matchScore += keyword.length;
        }
      }
      
      if (matchScore > highestScore) {
        highestScore = matchScore;
        bestMatch = q;
      }
    }
    
    // Only return match if score is above a threshold
    return highestScore > 3 ? bestMatch : undefined;
  }

  // Notification methods
  async getNotificationsForUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      notification => notification.userId === userId
    );
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const newNotification: Notification = {
      ...notification,
      id,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) {
      return undefined;
    }
    
    const updatedNotification: Notification = {
      ...notification,
      read: true,
    };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
}

export const storage = new MemStorage();
