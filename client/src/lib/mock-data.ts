// This file provides mock data structure references for development
// All actual data comes from the server/storage layer

export interface MockUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  points: number;
  teachableSkills: string[];
  learningSkills: string[];
  sessionsHosted: number;
  sessionsAttended: number;
  averageRating: number; // stored as integer * 10
  createdAt: Date;
}

export interface MockSession {
  id: string;
  title: string;
  description: string;
  hostId: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  maxParticipants: number;
  currentParticipants: number;
  cost: number;
  datetime: Date;
  duration: number;
  participants: string[];
  rating: number; // stored as integer * 10
  ratingCount: number;
  isCompleted: boolean;
  createdAt: Date;
  host?: {
    id: string;
    fullName: string;
    username: string;
    averageRating: number;
  };
}

// These categories and levels are used across the application
export const CATEGORIES = [
  'Programming',
  'Design', 
  'Data Science',
  'Business',
  'Language',
  'Music'
] as const;

export const LEVELS = [
  'beginner',
  'intermediate', 
  'advanced'
] as const;

export type Category = typeof CATEGORIES[number];
export type Level = typeof LEVELS[number];
