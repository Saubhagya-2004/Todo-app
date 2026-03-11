// app/_layout.tsx
// Root layout — wraps the entire app with Redux store, AuthProvider, and navigation.
// Routes between (auth) and (tabs) stacks based on authentication state.

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    // Provide the Redux store globally
    <Provider store={store}>
      {/* Provide Firebase Auth state globally */}
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          {/* Auth screens (login / register) */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          {/* Main app tabs */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </AuthProvider>
    </Provider>
  );
}
