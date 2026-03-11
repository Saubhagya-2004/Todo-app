// store/slices/tasksSlice.ts
// Redux slice for managing tasks state locally

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filterStatus: 'all' | 'active' | 'completed';
  filterPriority: 'all' | 'low' | 'medium' | 'high';
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  filterStatus: 'all',
  filterPriority: 'all',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Replace the entire task list (used after Firestore sync)
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    // Add a single new task
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },
    // Update an existing task by id
    updateTask(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    // Remove a task by id
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    // Toggle the completed status of a task
    toggleComplete(state, action: PayloadAction<string>) {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    // Update status filter (all / active / completed)
    setFilterStatus(state, action: PayloadAction<TasksState['filterStatus']>) {
      state.filterStatus = action.payload;
    },
    // Update priority filter
    setFilterPriority(state, action: PayloadAction<TasksState['filterPriority']>) {
      state.filterPriority = action.payload;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleComplete,
  setLoading,
  setError,
  setFilterStatus,
  setFilterPriority,
} = tasksSlice.actions;

export default tasksSlice.reducer;
