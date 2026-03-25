import { Stack } from 'expo-router';
import React from 'react';
import Colors from '@/constants/colors';

export default function PremiumLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.midnight },
        headerTintColor: Colors.white,
        contentStyle: { backgroundColor: Colors.midnight },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
