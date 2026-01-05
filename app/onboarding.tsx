import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing } from '@/constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur MY TICKET</Text>
      <Text style={styles.subtitle}>Crée ton ticket. Compare les cotes. Parie où tu veux.</Text>
      <Pressable style={styles.primaryButton} onPress={() => router.replace('/matches')}>
        <Text style={styles.primaryButtonText}>Commencer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.dark.muted,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  primaryButtonText: {
    color: Colors.dark.background,
    fontWeight: '700',
  },
});
