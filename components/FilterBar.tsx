


import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setFilterPriority, setFilterStatus } from '../store/slices/tasksSlice';

export default function FilterBar() {
  const dispatch = useAppDispatch();
  const { filterStatus, filterPriority } = useAppSelector((s) => s.tasks);

  const statusFilters: Array<{ label: string; value: typeof filterStatus }> = [
    { label: 'All', value: 'all' },
    { label: '⚡ Active', value: 'active' },
    { label: ' Done', value: 'completed' },
  ];

  const priorityFilters: Array<{ label: string; value: typeof filterPriority }> = [
    { label: 'Any Priority', value: 'all' },
    { label: ' High', value: 'high' },
    { label: ' Medium', value: 'medium' },
    { label: ' Low', value: 'low' },
  ];

  return (
    <View className="gap-2 pb-1">
      {}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-2 flex-row"
      >
        {statusFilters.map((f) => {
          const isActive = filterStatus === f.value;
          return (
            <TouchableOpacity
              key={f.value}
              className={`px-3.5 py-2 rounded-full border ${isActive ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}
              onPress={() => dispatch(setFilterStatus(f.value))}
              activeOpacity={0.7}
            >
              <Text className={`text-[13px] font-semibold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Priority filter row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-2 flex-row"
      >
        {priorityFilters.map((f) => {
          const isActive = filterPriority === f.value;
          return (
            <TouchableOpacity
              key={f.value}
              className={`px-3.5 py-2 rounded-full border ${isActive ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}
              onPress={() => dispatch(setFilterPriority(f.value))}
              activeOpacity={0.7}
            >
              <Text className={`text-[13px] font-semibold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
