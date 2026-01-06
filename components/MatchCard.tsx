import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { Match } from '@/types/match';

interface MatchCardProps {
  match: Match;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  riskLabel: string;
}

export const MatchCard = ({ match, isFavorite, onPress, onToggleFavorite, riskLabel }: MatchCardProps) => (
  <Pressable onPress={onPress} style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.league}>{match.league.name}</Text>
      <View style={styles.row}>
        <Text style={styles.time}>{match.time}</Text>
        <Pressable onPress={onToggleFavorite} hitSlop={8}>
          <MaterialCommunityIcons
            name={isFavorite ? 'star' : 'star-outline'}
            size={20}
            color={isFavorite ? Colors.dark.accent : Colors.dark.muted}
          />
        </Pressable>
      </View>
    </View>
    <View style={styles.teams}>
      <Text style={styles.team}>{match.homeTeam.name}</Text>
      <Text style={styles.vs}>vs</Text>
      <Text style={styles.team}>{match.awayTeam.name}</Text>
    </View>
    <View style={styles.footer}>
      <View style={styles.riskChip}>
        <Text style={styles.riskText}>{riskLabel}</Text>
      </View>
      <Text style={styles.country}>{match.league.country}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  league: {
    color: Colors.dark.accentSoft,
    fontWeight: '700',
  },
  time: {
    color: Colors.dark.muted,
    fontWeight: '600',
  },
  teams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  team: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '700',
  },
  vs: {
    color: Colors.dark.muted,
    fontWeight: '700',
  },
  footer: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskChip: {
    backgroundColor: Colors.dark.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  riskText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: '600',
  },
  country: {
    color: Colors.dark.muted,
    fontSize: 12,
  },
});
