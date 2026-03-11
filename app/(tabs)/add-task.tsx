// app/(tabs)/add-task.tsx
// Add Task screen — form to create a new task with all fields

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import { addTaskToFirestore } from '../../services/taskService';
import { Priority, Category, TaskFormData } from '../../types';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

// Priority selector options
const PRIORITIES: Array<{ value: Priority; label: string; colorClass: string; activeClass: string; textClass: string }> = [
  { value: 'low', label: ' Low', colorClass: 'border-emerald-200', activeClass: 'bg-emerald-50 border-emerald-500', textClass: 'text-emerald-500' },
  { value: 'medium', label: ' Medium', colorClass: 'border-amber-200', activeClass: 'bg-amber-50 border-amber-500', textClass: 'text-amber-500' },
  { value: 'high', label: ' High', colorClass: 'border-red-200', activeClass: 'bg-red-50 border-red-500', textClass: 'text-red-500' },
];

// Category options
const CATEGORIES: Array<{ value: Category; label: string; icon: any }> = [
  { value: 'work', label: 'Work', icon: 'briefcase' },
  { value: 'personal', label: 'Personal', icon: 'home' },
  { value: 'health', label: 'Health', icon: 'heart' },
  { value: 'finance', label: 'Finance', icon: 'dollar-sign' },
  { value: 'learning', label: 'Learning', icon: 'book' },
  { value: 'other', label: 'Other', icon: 'tag' },
];

export default function AddTaskScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('personal');
  const [dateTime, setDateTime] = useState(new Date());
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // default deadline tomorrow
    return d;
  });
  const [loading, setLoading] = useState(false);

  // Date picker visibility states
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  // Format date for display
  function formatDisplay(d: Date): string {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a task title.');
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      const formData: TaskFormData = {
        title: title.trim(),
        description: description.trim(),
        dateTime,
        deadline,
        priority,
        category,
      };
      await addTaskToFirestore(user.uid, formData);

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('personal');
      setDateTime(new Date());
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDeadline(tomorrow);

      Alert.alert('Success! ', 'Task added successfully.');
    } catch (error) {
      console.error('Failed to save task:', error);
      Alert.alert('Error', 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerClassName="p-6 pb-12 gap-5"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Screen heading */}
        <Text className="text-2xl font-extrabold text-slate-900">New Task</Text>
        <Text className="text-sm text-slate-500 -mt-3">What do you need to get done?</Text>

        {/* Title */}
        <View className="gap-2">
          <Text className="text-[13px] font-semibold text-slate-500 tracking-wider">Title *</Text>
          <TextInput
            className="bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-[15px] text-slate-900"
            placeholder="e.g. Prepare project presentation"
            placeholderTextColor="#475569"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            returnKeyType="next"
          />
        </View>

        {/* Description */}
        <View className="gap-2">
          <Text className="text-[13px] font-semibold text-slate-500 tracking-wider">Description</Text>
          <TextInput
            className="bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-[15px] text-slate-900 h-24 pt-3.5"
            placeholder="Add notes or details..."
            placeholderTextColor="#475569"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
        </View>

        {/* Priority selector */}
        <View className="gap-2">
          <Text className="text-[13px] font-semibold text-slate-500 tracking-wider">Priority</Text>
          <View className="flex-row gap-2.5">
            {PRIORITIES.map((p) => {
              const isActive = priority === p.value;
              return (
                <TouchableOpacity
                  key={p.value}
                  className={`flex-1 py-3 items-center rounded-xl border-[1.5px] bg-white ${isActive ? p.activeClass : 'border-slate-200'}`}
                  onPress={() => setPriority(p.value)}
                  activeOpacity={0.7}
                >
                  <Text className={`text-[13px] ${isActive ? p.textClass + ' font-bold' : 'text-slate-500 font-semibold'}`}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Category selector */}
        <View className="gap-2">
          <Text className="text-[13px] font-semibold text-slate-500 tracking-wider">Category</Text>
          <View className="flex-row flex-wrap gap-2.5">
            {CATEGORIES.map((c) => {
              const isActive = category === c.value;
              return (
                <TouchableOpacity
                  key={c.value}
                  className={`flex-row items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-[1.5px] bg-white ${isActive ? 'bg-blue-100 border-blue-600' : 'border-slate-200'}`}
                  onPress={() => setCategory(c.value)}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={c.icon}
                    size={16}
                    color={isActive ? '#2563EB' : '#64748B'}
                  />
                  <Text className={`text-[13px] font-semibold ${isActive ? 'text-blue-900' : 'text-slate-500'}`}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Date & Time — when task is scheduled */}
        <View className="gap-2">
          <Text className="text-[13px] font-semibold text-slate-500 tracking-wider">Scheduled Date & Time</Text>
          <TouchableOpacity
            className="flex-row items-center gap-2.5 bg-white border border-slate-300 rounded-xl px-4 py-3.5"
            onPress={() => setShowDateTimePicker(true)}
            activeOpacity={0.7}
          >
            <Feather name="calendar" size={18} color="#64748B" />
            <Text className="text-sm font-medium text-slate-900">{formatDisplay(dateTime)}</Text>
          </TouchableOpacity>
          {showDateTimePicker && (
            <DateTimePicker
              value={dateTime}
              mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_event, date) => {
                if (Platform.OS === 'android') setShowDateTimePicker(false);
                if (date) setDateTime(date);
              }}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Deadline */}
        <View className="gap-2">
          <Text className="text-[13px] font-semibold text-slate-500 tracking-wider">Deadline</Text>
          <TouchableOpacity
            className="flex-row items-center gap-2.5 bg-white border border-slate-300 rounded-xl px-4 py-3.5"
            onPress={() => setShowDeadlinePicker(true)}
            activeOpacity={0.7}
          >
            <Feather name="clock" size={18} color="#64748B" />
            <Text className="text-sm font-medium text-slate-900">{formatDisplay(deadline)}</Text>
          </TouchableOpacity>
          {showDeadlinePicker && (
            <DateTimePicker
              value={deadline}
              mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_event, date) => {
                if (Platform.OS === 'android') setShowDeadlinePicker(false);
                if (date) setDeadline(date);
              }}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Save button */}
        <TouchableOpacity
          className={`bg-blue-600 rounded-2xl py-4 items-center mt-2 shadow-md shadow-blue-600/30 elevation-sm ${loading ? 'opacity-60' : ''}`}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-base font-extrabold tracking-wide">Save Task</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
