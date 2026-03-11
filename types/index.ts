



export type Priority = 'low' | 'medium' | 'high';


export type FilterStatus = 'all' | 'active' | 'completed';


export type Category = 'work' | 'personal' | 'health' | 'finance' | 'learning' | 'other';


export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dateTime: string;      
  deadline: string;      
  priority: Priority;
  completed: boolean;
  category: Category;
  createdAt: string;     
}


export interface TaskFormData {
  title: string;
  description: string;
  dateTime: Date;
  deadline: Date;
  priority: Priority;
  category: Category;
}


export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}
