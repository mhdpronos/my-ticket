import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { RiskLevel } from '@/types/prediction';

interface FilterChipsProps {
  favoritesOnly: boolean;
  riskLevel: RiskLevel | 'ALL';
  onToggleFavorites: () => void;
  onSelectRisk: (value: RiskLevel | 'ALL') => void;
}

const riskOptions: Array<RiskLevel | 'ALL'> = ['ALL', 'SAFE', 'MEDIUM', 'RISKY'];

export const FilterChips = ({ favoritesOnly, riskLevel, onToggleFavorites, onSelectRisk }: FilterChipsProps) => (
  <View style={styles.container}>
    <Pressable
      onPress={onToggleFavorites}
      style={[styles.chip, favoritesOnly && styles.chipActive]}
    >
      <Text style={[styles.chipText, favoritesOnly && styles.chipTextActive]}>Favoris</Text>
    </Pressable>
    {riskOptions.map((option) => {
      const isActive = option === riskLevel;
      return (
        <Pressable
          key={option}
          onPress={() => onSelectRisk(option)}
          style={[styles.chip, isActive && styles.chipActive]}
        >
          <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
            {option === 'ALL' ? 'Tous' : option}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.dark.card,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  chipActive: {
    backgroundColor: Colors.dark.accent,
  },
  chipText: {
    color: Colors.dark.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.dark.background,
  },
});
