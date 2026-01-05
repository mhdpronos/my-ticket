import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { leagues, teams } from '@/data/mockCatalog';
import { useFavoritesStore } from '@/store/favoritesStore';

export default function FavoritesScreen() {
  const { teamIds, leagueIds, toggleTeam, toggleLeague } = useFavoritesStore();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Favoris</Text>
      <Text style={styles.subtitle}>Choisis tes équipes et ligues à suivre en priorité.</Text>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Équipes favorites</Text>
        <View style={styles.chips}>
          {teams.map((team) => {
            const isActive = teamIds.includes(team.id);
            return (
              <Text
                key={team.id}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => toggleTeam(team.id)}
              >
                {team.name}
              </Text>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Ligues favorites</Text>
        <View style={styles.chips}>
          {leagues.map((league) => {
            const isActive = leagueIds.includes(league.id);
            return (
              <Text
                key={league.id}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => toggleLeague(league.id)}
              >
                {league.name}
              </Text>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: '700',
    marginTop: Spacing.md,
  },
  subtitle: {
    color: Colors.dark.muted,
    marginBottom: Spacing.md,
  },
  content: {
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.dark.accentSoft,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.dark.card,
    borderRadius: Radius.sm,
    color: Colors.dark.muted,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  chipActive: {
    backgroundColor: Colors.dark.accent,
    color: Colors.dark.background,
  },
});
