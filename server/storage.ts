import { type User, type InsertUser, type Session, type InsertSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Session methods
  getSession(id: string): Promise<Session | undefined>;
  getAllSessions(): Promise<Session[]>;
  getSessionsByHost(hostId: string): Promise<Session[]>;
  getSessionsByParticipant(userId: string): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  joinSession(sessionId: string, userId: string): Promise<boolean>;
  leaveSession(sessionId: string, userId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, Session>;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create test user
    const testUser: User = {
      id: "user-1",
      username: "testuser",
      email: "test@example.com",
      fullName: "Test User",
      bio: "Passionate software developer with 5 years of experience in React and JavaScript. Love teaching and helping others learn to code!",
      points: 15,
      teachableSkills: ["JavaScript", "React", "UI Design"],
      learningSkills: ["Node.js", "TypeScript", "Python"],
      sessionsHosted: 3,
      sessionsAttended: 7,
      averageRating: 48, // 4.8 * 10
      createdAt: new Date(),
    };
    this.users.set(testUser.id, testUser);

    // Create some other users
    const otherUsers: User[] = [
      {
        id: "user-2",
        username: "janesmitty",
        email: "jane@example.com",
        fullName: "Jane Smith",
        bio: "Frontend developer and UI/UX enthusiast",
        points: 25,
        teachableSkills: ["UI/UX Design", "Figma", "Design Systems"],
        learningSkills: ["React", "Vue.js"],
        sessionsHosted: 5,
        sessionsAttended: 3,
        averageRating: 50,
        createdAt: new Date(),
      },
      {
        id: "user-3",
        username: "mikejohnson",
        email: "mike@example.com",
        fullName: "Mike Johnson",
        bio: "Data scientist and Python developer",
        points: 18,
        teachableSkills: ["Python", "Data Science", "Machine Learning"],
        learningSkills: ["JavaScript", "Web Development"],
        sessionsHosted: 4,
        sessionsAttended: 6,
        averageRating: 46,
        createdAt: new Date(),
      }
    ];

    otherUsers.forEach(user => this.users.set(user.id, user));

    // Create sample sessions
    const sampleSessions: Session[] = [
      {
        id: "session-1",
        title: "Introduction to React",
        description: "Learn the fundamentals of React development and build your first interactive components. Perfect for beginners!",
        hostId: "user-2",
        category: "Programming",
        level: "beginner",
        maxParticipants: 10,
        currentParticipants: 5,
        cost: 2,
        datetime: new Date("2024-12-15T14:00:00"),
        duration: 90,
        participants: ["user-1", "user-3"],
        rating: 45,
        ratingCount: 3,
        isCompleted: false,
        meetingRoomId: "room-session-1-intro-react",
        meetingStarted: false,
        createdAt: new Date(),
      },
      {
        id: "session-2",
        title: "UI/UX Design Principles",
        description: "Master the fundamentals of user interface and user experience design. Learn design thinking and prototyping.",
        hostId: "user-2",
        category: "Design",
        level: "intermediate",
        maxParticipants: 8,
        currentParticipants: 3,
        cost: 3,
        datetime: new Date("2024-12-16T10:00:00"),
        duration: 120,
        participants: ["user-1"],
        rating: 48,
        ratingCount: 5,
        isCompleted: false,
        meetingRoomId: "room-session-2-ux-design",
        meetingStarted: false,
        createdAt: new Date(),
      },
      {
        id: "session-creates",
        title: "sushil's course",
        description: "Learn how to be like sushil.",
        hostId: "user-1",
        category: "Sushil",
        level: "advanced",  
        maxParticipants: 60000,
        currentParticipants: 40000,
        cost: 5,
        datetime: new Date("2024-12-20T15:00:00"),
        duration: 180,
        participants: ["user-2", "user-3"],
        rating: 50,
        ratingCount: 500,
        isCompleted: false,
        meetingRoomId: "susu-chawn",
        meetingStarted: false,
        createdAt: new Date(),
      },
      {
        id: "session-3",
        title: "Python for Data Science",
        description: "Introduction to Python programming for data analysis. Learn pandas, numpy, and matplotlib basics.",
        hostId: "user-3",
        category: "Data Science",
        level: "intermediate",
        maxParticipants: 12,
        currentParticipants: 8,
        cost: 4,
        datetime: new Date("2024-12-17T18:00:00"),
        duration: 150,
        participants: [],
        rating: 46,
        ratingCount: 8,
        isCompleted: false,
        meetingRoomId: "room-session-3-python-data",
        meetingStarted: false,
        createdAt: new Date(),
      },
      {
        id: "session-4",
        title: "Advanced React Patterns",
        description: "Learn advanced React patterns including render props, higher-order components, and compound components.",
        hostId: "user-1",
        category: "Programming",
        level: "advanced",
        maxParticipants: 6,
        currentParticipants: 4,
        cost: 5,
        datetime: new Date("2024-12-20T15:00:00"),
        duration: 180,
        participants: ["user-2", "user-3"],
        rating: 50,
        ratingCount: 2,
        isCompleted: false,
        meetingRoomId: "room-session-4-advanced-react",
        meetingStarted: false,
        createdAt: new Date(),
      }
    ];

    sampleSessions.forEach(session => this.sessions.set(session.id, session));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      bio: insertUser.bio || null,
      createdAt: new Date(),
      points: insertUser.points || 20,
      teachableSkills: (insertUser.teachableSkills || []) as string[],
      learningSkills: (insertUser.learningSkills || []) as string[],
      sessionsHosted: 0,
      sessionsAttended: 0,
      averageRating: 0,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getAllSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values()).sort((a, b) => 
      new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );
  }

  async getSessionsByHost(hostId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      session => session.hostId === hostId
    );
  }

  async getSessionsByParticipant(userId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      session => (session.participants || []).includes(userId)
    );
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const meetingRoomId = `room-${id.split('-')[0]}-${insertSession.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const session: Session = {
      ...insertSession,
      id,
      currentParticipants: 0,
      participants: [],
      rating: 0,
      ratingCount: 0,
      isCompleted: false,
      meetingRoomId,
      meetingStarted: false,
      createdAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async joinSession(sessionId: string, userId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const user = this.users.get(userId);
    
    if (!session || !user) return false;
    if ((session.participants || []).includes(userId)) return false;
    if ((session.currentParticipants || 0) >= session.maxParticipants) return false;
    if ((user.points || 0) < session.cost) return false;

    // Update session
    session.participants = session.participants || [];
    session.participants.push(userId);
    session.currentParticipants = session.participants.length;
    
    // Update user points and stats
    user.points = (user.points || 0) - session.cost;
    user.sessionsAttended = (user.sessionsAttended || 0) + 1;
    
    this.sessions.set(sessionId, session);
    this.users.set(userId, user);
    
    return true;
  }

  async leaveSession(sessionId: string, userId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const user = this.users.get(userId);
    
    if (!session || !user) return false;
    if (!(session.participants || []).includes(userId)) return false;

    // Update session
    session.participants = (session.participants || []).filter(id => id !== userId);
    session.currentParticipants = session.participants.length;
    
    // Refund user points and update stats
    user.points = (user.points || 0) + session.cost;
    user.sessionsAttended = Math.max(0, (user.sessionsAttended || 0) - 1);
    
    this.sessions.set(sessionId, session);
    this.users.set(userId, user);
    
    return true;
  }
}

export const storage = new MemStorage();
