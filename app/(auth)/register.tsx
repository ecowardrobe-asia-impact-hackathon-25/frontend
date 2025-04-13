import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Text } from '../../components/common/Text';
import { theme } from '../../constants/theme';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useRouter();
  const handleRegister = async () => {
    // Implement actual registration logic
    const res = await auth().createUserWithEmailAndPassword(email, password);
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

          <Card style={styles.formCard}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

            <Button 
              title="Sign Up" 
              onPress={handleRegister} 
              style={styles.button}
            />
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text variant="caption" style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color={theme.colors.text} />
              <Text>Google</Text>
            </TouchableOpacity>
            {Platform.OS === 'ios' && (
              <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={24} color={theme.colors.text} />
              <Text>Apple</Text>
              </TouchableOpacity>
            )}
          </View>
          
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('/login')}
            style={styles.linkContainer}
          >
            <Text style={styles.link}>Already have an account? Sign in</Text>
          </TouchableOpacity>
          </Card>
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
  },
  formCard: {
    padding: theme.spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    marginHorizontal: theme.spacing.sm,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
  },
}); 