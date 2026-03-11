import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setTasks } from '../../store/slices/tasksSlice';
import { subscribeTasks } from '../../services/taskService';
import { sortTasks } from '../../utils/sortTasks';
import TaskCard from '../../components/TaskCard';
import FilterBar from '../../components/FilterBar';
import EmptyState from '../../components/EmptyState';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { tasks, filterStatus, filterPriority } = useAppSelector((s) => s.tasks);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeTasks(
      user.uid,
      (firestoreTasks) => {
        dispatch(setTasks(firestoreTasks));
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        setLoading(false);
        setRefreshing(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const filteredTasks = React.useMemo(() => {
    let result = [...tasks];

    if (filterStatus === 'active') result = result.filter((t) => !t.completed);
    else if (filterStatus === 'completed') result = result.filter((t) => t.completed);

    if (filterPriority !== 'all')
      result = result.filter((t) => t.priority === filterPriority);

    return sortTasks(result);
  }, [tasks, filterStatus, filterPriority]);

  const activeCount = tasks.filter((t) => !t.completed).length;
  const totalCount = tasks.length;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center gap-3">
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-slate-500 text-sm">Loading your tasks...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <StatusBar style="dark" />

      {}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-5">
        <View>
          <Text className="text-2xl font-extrabold text-slate-900">
            Hey, {user?.displayName?.split(' ')[0] ?? 'there'} 
          </Text>
          <Text className="text-sm text-slate-500 mt-1">
            {activeCount} active · {totalCount} total tasks
          </Text>
        </View>
        
        {totalCount > 0 && (
          <View className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 items-center justify-center">
            <Text className="text-lg font-extrabold text-blue-600">
              {Math.round(((totalCount - activeCount) / totalCount) * 100)}%
            </Text>
            <Text className="text-[10px] font-semibold text-slate-500">done</Text>
          </View>
        )}
      </View>

      {}
      <FilterBar />

      {}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item} />}
        contentContainerClassName={filteredTasks.length === 0 ? "flex-1 justify-center" : "pt-2 pb-6"}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={
          <EmptyState
            message={
              filterStatus !== 'all' || filterPriority !== 'all'
                ? 'No matching tasks'
                : 'No tasks yet'
            }
            submessage={
              filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try clearing the filters'
                : 'Tap the Add Task tab to add your first task'
            }
          />
        }
      />
    </SafeAreaView>
  );
}
