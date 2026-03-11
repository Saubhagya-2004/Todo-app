



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
    
    <Provider store={store}>
      {}
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          {}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          {}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </AuthProvider>
    </Provider>
  );
}
