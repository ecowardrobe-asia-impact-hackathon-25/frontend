import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { theme } from '../../constants/theme';

interface PlaceholderImageProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  text?: string;
}

export function PlaceholderImage({ 
  width, 
  height, 
  borderRadius = theme.borderRadius.base,
  text
}: PlaceholderImageProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
        },
      ]}
    >
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  }
}); 