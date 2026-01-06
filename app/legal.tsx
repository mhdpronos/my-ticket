import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

export default function LegalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mentions légales</Text>
      <Text style={styles.subtitle}>
        MY TICKET fournit des pronostics sportifs et ne propose pas de paris en ligne.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: Spacing.lg,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.dark.muted,
    marginTop: Spacing.sm,
  },
});
