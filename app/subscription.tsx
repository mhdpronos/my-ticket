import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';

export default function SubscriptionScreen() {
  const { setAccess } = useUserStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MY TICKET Premium</Text>
      <Text style={styles.subtitle}>
        Accède aux pronostics premium, aux meilleures cotes et à l'historique avancé.
      </Text>

      <View style={styles.plan}>
        <Text style={styles.planTitle}>Plan Mensuel</Text>
        <Text style={styles.planPrice}>9,99 € / mois</Text>
        <Text style={styles.planDesc}>Annulation à tout moment.</Text>
      </View>

      <View style={styles.plan}>
        <Text style={styles.planTitle}>Plan Annuel</Text>
        <Text style={styles.planPrice}>89,99 € / an</Text>
        <Text style={styles.planDesc}>Économise 25% sur l'année.</Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={() => setAccess('PREMIUM')}>
        <Text style={styles.primaryButtonText}>Activer Premium</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.dark.muted,
  },
  plan: {
    backgroundColor: Colors.dark.card,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: Spacing.xs,
  },
  planTitle: {
    color: Colors.dark.accentSoft,
    fontWeight: '700',
  },
  planPrice: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '700',
  },
  planDesc: {
    color: Colors.dark.muted,
  },
  primaryButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.dark.accent,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.dark.background,
    fontWeight: '700',
  },
});
