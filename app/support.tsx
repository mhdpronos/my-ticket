import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aide & Support</Text>
      <Text style={styles.subtitle}>Contacte-nous : support@myticket.app</Text>
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
