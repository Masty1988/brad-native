import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import BradHeader from '@/components/BradHeader';
import { BradColors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: BradColors.bleuBrad,
        header: () => <BradHeader />,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="shield.checkered" color={color} />,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="brain.head.profile" color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Arnaques',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="exclamationmark.triangle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
