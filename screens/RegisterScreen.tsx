import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Text } from '../components/common/Text';
import { theme } from '../constants/theme';

export default function RegisterScreen({ navigation }) {
  const handleRegister = () => {
    // Implement actual registration logic
    console.log('Register button pressed');
  };

  return (
    <LinearGradient
      colors={['#121212', '#1E1E1E']}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <Text variant="h1" style={styles.title}>Ecowardrobe</Text>
        <Text style={styles.subtitle}>Your sustainable fashion assistant</Text>
        
        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>Create Account</Text>
          
          <Button 
            title="Sign Up" 
            onPress={handleRegister} 
            style={styles.button}
          />
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            style={styles.linkContainer}
          >
            <Text style={styles.link}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.white,
  },
  subtitle: {
    marginBottom: theme.spacing.xl,
    color: theme.colors.textSecondary,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  cardTitle: {
    marginBottom: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.md,
  },
  linkContainer: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  link: {
    color: theme.colors.primary,
  }
}); 