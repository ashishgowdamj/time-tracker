import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertLanguageSchema, insertSessionSchema, insertChatbotQuestionSchema, insertNotificationSchema, sessionWithTimeZoneSchema } from "@shared/schema";
import { z } from "zod";
import { formatISO, parseISO } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/current", async (req, res) => {
    // In a real app, this would use the session to get the current user
    // For demo purposes, return the first user
    const user = await storage.getUser(1);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  });

  app.get("/api/users/stats", async (req, res) => {
    // Get user stats
    const stats = await storage.getUserStats(1);
    return res.json(stats);
  });

  app.patch("/api/users/profile", async (req, res) => {
    try {
      const updateSchema = insertUserSchema.partial();
      const userData = updateSchema.parse(req.body);
      const updatedUser = await storage.updateUser(1, userData);
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Language routes
  app.get("/api/languages", async (req, res) => {
    // Get languages for user
    const languages = await storage.getLanguagesForUser(1);
    return res.json(languages);
  });

  app.post("/api/languages", async (req, res) => {
    try {
      const languageData = insertLanguageSchema.parse(req.body);
      const language = await storage.createLanguage(languageData);
      res.status(201).json(language);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create language" });
    }
  });

  app.patch("/api/languages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateSchema = insertLanguageSchema.partial();
      const languageData = updateSchema.parse(req.body);
      const language = await storage.updateLanguage(id, languageData);
      if (!language) {
        return res.status(404).json({ message: "Language not found" });
      }
      res.json(language);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update language" });
    }
  });

  app.delete("/api/languages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLanguage(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete language" });
    }
  });

  // Session routes
  app.get("/api/sessions", async (req, res) => {
    // Get sessions for user
    const sessions = await storage.getSessionsForUser(1);
    return res.json(sessions);
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      // Handle time zone conversion
      const sessionData = sessionWithTimeZoneSchema.parse(req.body);
      
      // Convert date and times to ISO string in UTC
      const dateStr = sessionData.date;
      const startTimeStr = sessionData.startTime;
      const endTimeStr = sessionData.endTime;
      const userTimeZone = sessionData.userTimeZone;
      
      // Create Date objects in user's time zone
      const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
      const [endHours, endMinutes] = endTimeStr.split(':').map(Number);
      
      const startDate = new Date(dateStr);
      startDate.setHours(startHours, startMinutes, 0, 0);
      
      const endDate = new Date(dateStr);
      endDate.setHours(endHours, endMinutes, 0, 0);
      
      // Convert to UTC for storage
      const utcStartTime = fromZonedTime(startDate, userTimeZone);
      const utcEndTime = fromZonedTime(endDate, userTimeZone);
      
      // Create session with UTC times
      const session = await storage.createSession({
        title: sessionData.title,
        description: sessionData.description || "",
        startTime: formatISO(utcStartTime as Date),
        endTime: formatISO(utcEndTime as Date),
        languageId: sessionData.languageId,
        userId: 1, // Hardcoded for demo
        partnerId: sessionData.partnerId,
        partnerName: sessionData.partnerName,
        partnerTimeZone: sessionData.partnerTimeZone,
        status: "scheduled"
      });
      
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to get session" });
    }
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateSchema = insertSessionSchema.partial();
      const sessionData = updateSchema.parse(req.body);
      const session = await storage.updateSession(id, sessionData);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  app.delete("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSession(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete session" });
    }
  });

  // Chatbot routes
  app.get("/api/chatbot/questions", async (req, res) => {
    // Get all chatbot questions
    const questions = await storage.getChatbotQuestions();
    return res.json(questions);
  });

  app.post("/api/chatbot/query", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Invalid query" });
      }
      
      // Find best matching response
      const questions = await storage.getChatbotQuestions();
      const response = await storage.findChatbotResponse(query);
      
      if (response) {
        return res.json({ answer: response.answer });
      }
      
      // Fallback response
      return res.json({ 
        answer: "I'm not sure I understand. Try asking about scheduling, time zones, or languages."
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to process query" });
    }
  });

  // Notification routes
  app.get("/api/notifications", async (req, res) => {
    // Get notifications for user
    const notifications = await storage.getNotificationsForUser(1);
    return res.json(notifications);
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
