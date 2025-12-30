import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import BradHeader from '@/components/BradHeader';
import { HapticTab } from '@/components/haptic-tab';
import { BradColors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: BradColors.bleuBrad,
        tabBarInactiveTintColor: '#9CA3AF',
        header: () => <BradHeader />,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) => <Feather name="shield" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color }) => <Feather name="help-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Arnaques',
          tabBarIcon: ({ color }) => <Feather name="alert-triangle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}