import React from 'react';
import { Text as RNText, TextStyle, StyleSheet, StyleProp } from 'react-native';
import { theme } from '../../constants/theme';

interface TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
}

export function Text({
  children,
  style,
  variant = 'body',
}: TextProps) {
  return (
    <RNText style={[styles.base, styles[variant], style]}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: theme.colors.text,
    fontSize: theme.fontSize.base,
  },
  h1: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
  body: {
    fontSize: theme.fontSize.base,
  },
  caption: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
}); 