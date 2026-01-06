import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { Prediction } from '@/types/prediction';

interface PredictionRowProps {
  prediction: Prediction;
  onAddToTicket: () => void;
}

export const PredictionRow = ({ prediction, onAddToTicket }: PredictionRowProps) => (
  <View style={styles.container}>
    <View style={styles.info}>
      <Text style={styles.label}>{prediction.label}</Text>
      <Text style={styles.market}>{prediction.market}</Text>
    </View>
    <View style={styles.actions}>
      <View style={styles.riskChip}>
        <Text style={styles.riskText}>{prediction.riskLevel}</Text>
      </View>
      <Pressable onPress={onAddToTicket} style={styles.addButton} hitSlop={8}>
        <MaterialCommunityIcons name="plus" size={16} color={Colors.dark.background} />
        <Text style={styles.addText}>Ticket</Text>
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  info: {
    flex: 1,
  },
  label: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  market: {
    color: Colors.dark.muted,
    fontSize: 12,
  },
  actions: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  riskChip: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  riskText: {
    color: Colors.dark.muted,
    fontSize: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  addText: {
    color: Colors.dark.background,
    fontSize: 12,
    fontWeight: '700',
  },
});
