import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  bio: text("bio"),
  points: integer("points").default(20),
  teachableSkills: jsonb("teachable_skills").$type<string[]>().default([]),
  learningSkills: jsonb("learning_skills").$type<string[]>().default([]),
  sessionsHosted: integer("sessions_hosted").default(0),
  sessionsAttended: integer("sessions_attended").default(0),
  averageRating: integer("average_rating").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  hostId: varchar("host_id").notNull(),
  category: text("category").notNull(),
  level: text("level").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").default(0),
  cost: integer("cost").notNull(), 
  datetime: timestamp("datetime").notNull(),
  duration: integer("duration").notNull(),
  participants: jsonb("participants").$type<string[]>().default([]),
  rating: integer("rating").default(0), 
  ratingCount: integer("rating_count").default(0),
  isCompleted: boolean("is_completed").default(false),
  meetingRoomId: varchar("meeting_room_id").notNull(), // unique room ID for video calls
  meetingStarted: boolean("meeting_started").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
  currentParticipants: true,
  participants: true,
  rating: true,
  ratingCount: true,
  isCompleted: true,
  meetingRoomId: true,
  meetingStarted: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
