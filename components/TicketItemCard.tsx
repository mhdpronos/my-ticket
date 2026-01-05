import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { Match } from '@/types/match';
import type { Prediction } from '@/types/prediction';
import { bookmakers } from '@/data/mockCatalog';
import type { OddsByBookmaker } from '@/types/odds';

interface TicketItemCardProps {
  match: Match;
  prediction: Prediction;
  odds: OddsByBookmaker;
  onRemove: () => void;
}

export const TicketItemCard = ({ match, prediction, odds, onRemove }: TicketItemCardProps) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.matchTitle}>
        {match.homeTeam.shortName} vs {match.awayTeam.shortName}
      </Text>
      <Pressable onPress={onRemove} hitSlop={8}>
        <MaterialCommunityIcons name="close-circle" size={20} color={Colors.dark.danger} />
      </Pressable>
    </View>
    <Text style={styles.prediction}>{prediction.label}</Text>
    <Text style={styles.market}>{prediction.market}</Text>

    <Text style={styles.sectionTitle}>Parier avec</Text>
    <View style={styles.bookmakers}>
      {bookmakers.map((bookmaker) => (
        <View key={bookmaker.id} style={styles.bookmakerCard}>
          <Text style={styles.bookmakerName}>{bookmaker.name}</Text>
          <Text style={styles.bookmakerOdd}>Cote: {odds[bookmaker.id].toFixed(2)}</Text>
        </View>
      ))}
    </View>
  </View>
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
  },
  matchTitle: {
    color: Colors.dark.text,
    fontWeight: '700',
  },
  prediction: {
    color: Colors.dark.accentSoft,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  market: {
    color: Colors.dark.muted,
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  bookmakers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  bookmakerCard: {
    backgroundColor: Colors.dark.surface,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    minWidth: 120,
  },
  bookmakerName: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  bookmakerOdd: {
    color: Colors.dark.accent,
    fontWeight: '700',
  },
});
