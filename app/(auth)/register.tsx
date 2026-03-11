


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

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      Alert.alert('Account Created', 'Please sign in with your new credentials.');
      router.replace('/(auth)/login');
    } catch (error: any) {
      let message = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use')
        message = 'An account already exists with this email.';
      else if (error.code === 'auth/invalid-email')
        message = 'Invalid email address.';
      else if (error.code === 'auth/weak-password')
        message = 'Password is too weak. Use at least 6 characters.';
      Alert.alert('Registration Failed', message);
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
        {}
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center mb-4 shadow-lg shadow-blue-500/50 elevation-xl">
            <Text className="text-3xl color-white">✦</Text>
          </View>
          <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">TaskFlow</Text>
          <Text className="text-sm text-slate-500 mt-1">Get organized, stay ahead</Text>
        </View>

        {}
        <View className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm shadow-slate-200 elevation-sm gap-4">
          <Text className="text-2xl font-extrabold text-slate-900">Create account</Text>
          <Text className="text-sm text-slate-500 -mt-1.5">Join TaskFlow for free</Text>

          {}
          <View className="gap-1.5">
            <Text className="text-[13px] font-semibold text-slate-400 tracking-wider">Full Name</Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-[15px] text-slate-900"
              placeholder="John Doe"
              placeholderTextColor="#475569"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {}
          <View className="gap-1.5">
            <Text className="text-[13px] font-semibold text-slate-400 tracking-wider">Email</Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-[15px] text-slate-900"
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

          {}
          <View className="gap-1.5">
            <Text className="text-[13px] font-semibold text-slate-400 tracking-wider">Password</Text>
            <View className="relative">
              <TextInput
                className="bg-white border border-slate-300 rounded-xl pl-4 pr-12 py-3 text-[15px] text-slate-900"
                placeholder="Min. 6 characters"
                placeholderTextColor="#475569"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="next"
              />
              <TouchableOpacity
                className="absolute right-3.5 top-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {}
          <View className="gap-1.5">
            <Text className="text-[13px] font-semibold text-slate-400 tracking-wider">Confirm Password</Text>
            <TextInput
              className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-[15px] text-slate-900"
              placeholder="Repeat your password"
              placeholderTextColor="#475569"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
          </View>

          {}
          <TouchableOpacity
            className={`bg-blue-600 rounded-xl py-4 items-center mt-1 shadow-md shadow-blue-600/30 elevation-sm ${loading ? 'opacity-60' : ''}`}
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-extrabold tracking-wide">Create Account →</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Login link */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-sm text-slate-500">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-sm font-bold text-blue-600">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
