import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes - IMPORTANT: More specific routes must come before parameterized routes
  app.get("/api/users/current", async (req, res) => {
    try {
      // For demo purposes, return the test user
      const user = await storage.getUser("user-1");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Session routes
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      
      // Enrich sessions with host information
      const enrichedSessions = await Promise.all(
        sessions.map(async (session) => {
          const host = await storage.getUser(session.hostId);
          return {
            ...session,
            host: host ? {
              id: host.id,
              fullName: host.fullName,
              username: host.username,
              averageRating: host.averageRating
            } : null
          };
        })
      );
      
      res.json(enrichedSessions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Enrich with host information
      const host = await storage.getUser(session.hostId);
      const enrichedSession = {
        ...session,
        host: host ? {
          id: host.id,
          fullName: host.fullName,
          username: host.username,
          averageRating: host.averageRating
        } : null
      };
      
      res.json(enrichedSession);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const result = insertSessionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid session data", errors: result.error.errors });
      }
      
      const session = await storage.createSession(result.data);
      
      // Update host's sessions hosted count
      const host = await storage.getUser(session.hostId);
      if (host) {
        await storage.updateUser(host.id, {
          sessionsHosted: (host.sessionsHosted || 0) + 1
        });
      }
      
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/sessions/:id/join", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const success = await storage.joinSession(req.params.id, userId);
      if (!success) {
        return res.status(400).json({ message: "Unable to join session" });
      }
      
      res.json({ message: "Successfully joined session" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/sessions/:id/leave", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const success = await storage.leaveSession(req.params.id, userId);
      if (!success) {
        return res.status(400).json({ message: "Unable to leave session" });
      }
      
      res.json({ message: "Successfully left session" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/sessions/:id/start-meeting", async (req, res) => {
    try {
      const session = await storage.updateSession(req.params.id, { meetingStarted: true });
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json({ 
        message: "Meeting started successfully",
        meetingRoomId: session.meetingRoomId,
        meetingStarted: session.meetingStarted
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/sessions/:id/meeting-room", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json({
        meetingRoomId: session.meetingRoomId,
        meetingStarted: session.meetingStarted,
        sessionTitle: session.title,
        hostId: session.hostId,
        participants: session.participants
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:id/sessions/hosted", async (req, res) => {
    try {
      const sessions = await storage.getSessionsByHost(req.params.id);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:id/sessions/attended", async (req, res) => {
    try {
      const sessions = await storage.getSessionsByParticipant(req.params.id);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
