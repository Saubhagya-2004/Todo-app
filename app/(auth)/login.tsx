// app/(auth)/login.tsx
// Login screen with email/password authentication via Firebase

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('Firebase Login Error:', error);
      let message = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
      else if (error.code === 'auth/wrong-password') message = 'Incorrect password.';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
      else if (error.code === 'auth/invalid-credential') message = 'Invalid email or password.';
      else if (error.message) message = error.message;
      
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerClassName="grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Brand */}
        <View className="items-center mb-9">
          <View className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center mb-4 shadow-lg shadow-blue-500/50 elevation-xl">
            <Text className="text-3xl color-white">✦</Text>
          </View>
          <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">TaskFlow</Text>
          <Text className="text-sm text-slate-500 mt-1">Your intelligent task companion</Text>
        </View>

        {/* Card */}
        <View className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm shadow-slate-200 elevation-sm gap-4">
          <Text className="text-2xl font-extrabold text-slate-900">Welcome back</Text>
          <Text className="text-sm text-slate-500 -mt-2">Sign in to your account</Text>

          {/* Email field */}
          <View className="gap-1.5">
            <Text className="text-[13px] font-semibold text-slate-400 tracking-wider">Email</Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-[15px] text-slate-900"
              placeholder="you@example.com"
              placeholderTextColor="#475569"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* Password field */}
          <View className="gap-1.5">
            <Text className="text-[13px] font-semibold text-slate-400 tracking-wider">Password</Text>
            <View className="relative">
              <TextInput
                className="bg-white border border-slate-300 rounded-xl pl-4 pr-12 py-3.5 text-[15px] text-slate-900"
                placeholder="••••••••"
                placeholderTextColor="#475569"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                className="absolute right-3.5 top-3.5"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login button */}
          <TouchableOpacity
            className={`bg-blue-600 rounded-xl py-4 items-center mt-1 shadow-md shadow-blue-600/30 elevation-sm ${loading ? 'opacity-60' : ''}`}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-extrabold tracking-wide">Sign In →</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register link */}
        <View className="flex-row justify-center items-center mt-7">
          <Text className="text-sm text-slate-500">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-sm font-bold text-blue-600">Create one</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
