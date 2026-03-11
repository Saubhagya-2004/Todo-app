


import React from 'react';
import { View, Text } from 'react-native';
import { Priority } from '../types';

interface PriorityBadgeProps {
  priority: Priority;
}


const PRIORITY_CONFIG: Record<
  Priority,
  { bgClass: string; borderClass: string; textClass: string; label: string; emoji: string }
> = {
  high: { bgClass: 'bg-red-50', borderClass: 'border-red-500', textClass: 'text-red-500', label: 'High', emoji: '🔴' },
  medium: { bgClass: 'bg-amber-50', borderClass: 'border-amber-500', textClass: 'text-amber-500', label: 'Medium', emoji: '🟡' },
  low: { bgClass: 'bg-emerald-50', borderClass: 'border-emerald-500', textClass: 'text-emerald-500', label: 'Low', emoji: '🟢' },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  return (
    <View
      className={`px-2 py-0.5 rounded-full border self-start ${config.bgClass} ${config.borderClass}`}
    >
      <Text className={`text-[11px] font-bold tracking-wide ${config.textClass}`}>
        {config.emoji} {config.label}
      </Text>
    </View>
  );
}
