import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { CustomTabBar } from '@/components/BottomTabs';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
        tabBarShowLabel: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
      >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="home-outline" size={24} color={focused ? theme.colors.primary : 'rgba(255, 255, 255, 0.5)'} />
          ),
        }}
      />
      <Tabs.Screen
        name="wardrobe"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="shirt-outline" size={24} color={focused ? theme.colors.primary : 'rgba(255, 255, 255, 0.5)'} />
          ),
        }}
      />
      <Tabs.Screen
        name="mix-match"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="color-wand-outline" size={24} color={focused ? theme.colors.primary : 'rgba(255, 255, 255, 0.5)'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="person-outline" size={24} color={focused ? theme.colors.primary : 'rgba(255, 255, 255, 0.5)'} />
          ),
        }}
      />
    </Tabs>
  );
}
