


import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EmptyStateProps {
  message?: string;
  submessage?: string;
}

export default function EmptyState({
  message = 'No tasks yet',
  submessage = 'Tap the Add Task  tab to add your first task',
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {}
     
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.subtitle}>{submessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E1E3A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#7C3AED40',
  },
  icon: {
    fontSize: 36,
  },
  title: {
    color: '#F1F5F9',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
