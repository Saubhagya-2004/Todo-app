// types/index.ts
// Shared TypeScript interfaces and types for the Todo App

// Task priority levels
export type Priority = 'low' | 'medium' | 'high';

// Task status filter options
export type FilterStatus = 'all' | 'active' | 'completed';

// Category tags for tasks
export type Category = 'work' | 'personal' | 'health' | 'finance' | 'learning' | 'other';

// Core Task interface stored in Firestore
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dateTime: string;      // ISO string - when the task should be done
  deadline: string;      // ISO string - final deadline
  priority: Priority;
  completed: boolean;
  category: Category;
  createdAt: string;     // ISO string - when task was created
}

// Form data for creating/editing tasks (no id/userId/createdAt yet)
export interface TaskFormData {
  title: string;
  description: string;
  dateTime: Date;
  deadline: Date;
  priority: Priority;
  category: Category;
}

// Authenticated user info (simplified subset of Firebase User)
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}
