import { pgTable, text, serial, integer, boolean, timestamp, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  timeZone: text("time_zone").notNull().default("UTC"),
  avatar: text("avatar"),
  plan: text("plan").default("Free"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Languages table
export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  level: text("level").notNull().default("beginner"),
  progress: integer("progress").notNull().default(0),
  userId: integer("user_id").notNull(),
});

// Sessions table
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  languageId: integer("language_id").notNull(),
  userId: integer("user_id").notNull(),
  partnerId: integer("partner_id"),
  partnerName: text("partner_name"),
  partnerTimeZone: text("partner_time_zone"),
  status: text("status").notNull().default("scheduled"),
});

// ChatbotQuestions table
export const chatbotQuestions = pgTable("chatbot_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  keywords: text("keywords").array().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for insertion
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLanguageSchema = createInsertSchema(languages).omit({
  id: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
});

export const insertChatbotQuestionSchema = createInsertSchema(chatbotQuestions).omit({
  id: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type Language = typeof languages.$inferSelect;

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

export type InsertChatbotQuestion = z.infer<typeof insertChatbotQuestionSchema>;
export type ChatbotQuestion = typeof chatbotQuestions.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Session input validation schema with time zone
export const sessionWithTimeZoneSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  languageId: z.number(),
  userTimeZone: z.string(),
  partnerTimeZone: z.string().optional(),
  partnerId: z.number().optional(),
  partnerName: z.string().optional(),
});

export type SessionWithTimeZone = z.infer<typeof sessionWithTimeZoneSchema>;
