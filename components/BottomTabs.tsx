import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { PlaceholderImage } from '../components/common/PlaceholderImage';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let icon;
          if (route.name === 'Profile') {
            icon = (
              <PlaceholderImage
                width={32}
                height={32}
                text="JD"
                borderRadius={16}
              />
            );
          } else {
            // icon = (
            //   <Ionicons
            //     name={options.tabBarIcon({ 
            //       focused: isFocused, 
            //       color: '', 
            //       size: 0 
            //     }).props.name}
            //     size={24}
            //     color={isFocused ? theme.colors.primary : 'rgba(255, 255, 255, 0.5)'}
            //   />
            // );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                styles.tab,
                isFocused && styles.tabFocused
              ]}
            >
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('Upload')}
      >
        <Ionicons name="add" size={24} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    height: 64,
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: 32,
    padding: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 26,
    marginHorizontal: 4,
  },
  tabFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
}); 