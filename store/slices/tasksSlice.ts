


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
    
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },
    
    updateTask(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    
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
    
    setFilterStatus(state, action: PayloadAction<TasksState['filterStatus']>) {
      state.filterStatus = action.payload;
    },
    
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
