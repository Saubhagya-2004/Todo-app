


import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useAppSelector } from '../../store/hooks';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const tasks = useAppSelector((s) => s.tasks.tasks);

  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const highPriorityActive = tasks.filter(
    (t) => t.priority === 'high' && !t.completed
  ).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  
  const initials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? '?';

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerClassName="p-6 pb-12 gap-6"
        showsVerticalScrollIndicator={false}
      >
        {}
        <Text className="text-3xl font-extrabold text-slate-900">Profile</Text>

        {}
        <View className="bg-white rounded-3xl p-7 items-center border border-slate-200 gap-2">
          <View className="w-20 h-20 rounded-full bg-blue-600 items-center justify-center mb-2 shadow-lg shadow-blue-600/50 elevation-md">
            <Text className="text-white text-3xl font-extrabold">{initials}</Text>
          </View>
          <Text className="text-slate-900 text-xl font-extrabold">
            {user?.displayName ?? 'TaskFlow User'}
          </Text>
          <Text className="text-slate-500 text-sm">{user?.email}</Text>
        </View>

        {}
        <Text className="text-slate-500 text-[13px] font-semibold tracking-wider -mb-3 mt-1">Your Stats</Text>
        <View className="flex-row flex-wrap gap-3">
          <StatCard value={totalTasks} label="Total Tasks" colorClass="text-blue-600" borderClass="border-blue-600/40" />
          <StatCard value={activeTasks} label="Active" colorClass="text-amber-500" borderClass="border-amber-500/40" />
          <StatCard value={completedTasks} label="Completed" colorClass="text-emerald-500" borderClass="border-emerald-500/40" />
          <StatCard value={highPriorityActive} label="Urgent" colorClass="text-red-500" borderClass="border-red-500/40" />
        </View>

        {}
        <View className="bg-white rounded-[20px] p-5 border border-slate-200 gap-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-slate-500 text-sm font-semibold">Overall Completion</Text>
            <Text className="text-blue-600 text-lg font-extrabold">{completionRate}%</Text>
          </View>
          <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </View>
        </View>

        {}
        <TouchableOpacity
          className="flex-row items-center justify-center gap-2.5 bg-red-50 border-[1.5px] border-red-200 rounded-2xl py-4 mt-2"
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          
          <Text className="text-red-500 text-base font-extrabold">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


function StatCard({
  value,
  label,
  colorClass,
  borderClass,
}: {
  value: number;
  label: string;
  colorClass: string;
  borderClass: string;
}) {
  return (
    <View className={`flex-1 min-w-[45%] bg-white rounded-2xl p-4 items-center border gap-1 ${borderClass}`}>
      <Text className={`text-3xl font-extrabold ${colorClass}`}>{value}</Text>
      <Text className="text-slate-500 text-xs font-semibold">{label}</Text>
    </View>
  );
}
