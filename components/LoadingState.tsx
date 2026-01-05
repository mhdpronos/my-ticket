import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface LoadingStateProps {
  label?: string;
}

export const LoadingState = ({ label }: LoadingStateProps) => (
  <View style={styles.container}>
    <ActivityIndicator color={Colors.dark.accent} />
    {label ? <Text style={styles.label}>{label}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    color: Colors.dark.muted,
  },
});
