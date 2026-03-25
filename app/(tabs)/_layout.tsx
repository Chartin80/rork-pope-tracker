import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Home, Globe, CalendarDays, Heart } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.midnightDeep,
          borderTopColor: 'rgba(212, 175, 55, 0.15)',
          borderTopWidth: StyleSheet.hairlineWidth,
          elevation: 0,
          shadowColor: Colors.gold,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600' as const,
          letterSpacing: 0.8,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size - 2} color={color} strokeWidth={1.8} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Globe size={size - 2} color={color} strokeWidth={1.8} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <CalendarDays size={size - 2} color={color} strokeWidth={1.8} />,
        }}
      />
      <Tabs.Screen
        name="premium"
        options={{
          title: 'Premium',
          tabBarIcon: ({ color, size }) => <Heart size={size - 2} color={color} strokeWidth={1.8} />,
        }}
      />
    </Tabs>
  );
}
