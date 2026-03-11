


import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { Task } from '../types';
import PriorityBadge from './PriorityBadge';
import { toggleComplete, deleteTask } from '../store/slices/tasksSlice';
import { useAppDispatch } from '../store/hooks';
import {
  toggleTaskComplete as toggleFirestore,
  deleteTaskFromFirestore,
} from '../services/taskService';

interface TaskCardProps {
  task: Task;
}


const PRIORITY_BORDER: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
};


function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}


function isOverdue(deadlineIso: string, completed: boolean): boolean {
  if (completed) return false;
  return new Date(deadlineIso).getTime() < Date.now();
}

export default function TaskCard({ task }: TaskCardProps) {
  const dispatch = useAppDispatch();
  
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const overdue = isOverdue(task.deadline, task.completed);

  
  async function handleToggle() {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const newCompleted = !task.completed;
    dispatch(toggleComplete(task.id));
    try {
      await toggleFirestore(task.id, newCompleted);
    } catch (e) {
      dispatch(toggleComplete(task.id));
    }
  }

  
  function handleDelete() {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            dispatch(deleteTask(task.id));
            try {
              await deleteTaskFromFirestore(task.id);
            } catch (e) {
              console.error('Failed to delete task from Firestore:', e);
            }
          },
        },
      ]
    );
  }

  return (
    <Animated.View
      className={`bg-white rounded-2xl mx-4 my-1.5 flex-row overflow-hidden border border-slate-200 shadow-sm shadow-slate-200 elevation-sm ${task.completed ? 'opacity-60' : 'opacity-100'}`}
      style={{ transform: [{ scale: scaleAnim }] }}
    >
      {/* Left priority accent strip */}
      <View
        className={`w-1 ${PRIORITY_BORDER[task.priority]}`}
      />

      {/* Main content */}
      <View className="flex-1 p-3.5 gap-2">
        {/* Top row: checkbox + title + delete */}
        <View className="flex-row items-start gap-2.5">
          {/* Completion checkbox */}
          <TouchableOpacity
            className={`w-[22px] h-[22px] rounded-md border-2 border-blue-600 items-center justify-center mt-0.5 shrink-0 ${task.completed ? 'bg-blue-600' : ''}`}
            onPress={handleToggle}
            activeOpacity={0.7}
          >
            {task.completed && <Text className="text-white text-[13px] font-black">✓</Text>}
          </TouchableOpacity>

          {/* Title */}
          <Text
            className={`flex-1 text-[15px] font-bold leading-[21px] ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {/* Delete button */}
          <TouchableOpacity
            className="p-1"
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text className="text-base">🗑</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        {task.description ? (
          <Text className="text-slate-500 text-[13px] leading-[18px] ml-8" numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        {/* Bottom row: priority badge + category + deadline */}
        <View className="flex-row items-center gap-2 ml-8 flex-wrap mt-0.5">
          <PriorityBadge priority={task.priority} />

          {task.category && task.category !== 'other' && (
            <View className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
              <Text className="text-slate-500 text-xs font-semibold">#{task.category}</Text>
            </View>
          )}

          <View className="ml-auto">
            <Text className={`text-[11px] font-medium ${overdue ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
              {overdue ? '⚠️' : '📅'} {formatDate(task.deadline)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
