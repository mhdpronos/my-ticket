import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TicketItemCard } from '@/components/TicketItemCard';
import { Colors, Spacing } from '@/constants/theme';
import { oddsService } from '@/services/oddsService';
import { matchesService } from '@/services/matchesService';
import { predictionsService } from '@/services/predictionsService';
import { useTicketStore } from '@/store/ticketStore';

export default function TicketScreen() {
  const { items, removeItem } = useTicketStore();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Ticket</Text>
      <Text style={styles.subtitle}>Ton ticket personnalisé avec les meilleures cotes.</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const match = matchesService.getMatchById(item.matchId);
          if (!match) {
            return null;
          }
          const prediction = predictionsService
            .getPredictionsByMatch(item.matchId)
            .find((pred) => pred.id === item.predictionId);
          if (!prediction) {
            return null;
          }
          const odds = oddsService.getOdds(item.matchId, prediction.market);

          return (
            <TicketItemCard
              match={match}
              prediction={prediction}
              odds={odds}
              onRemove={() => removeItem(item.id)}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title="Ticket vide"
            subtitle="Ajoute un prono depuis les matchs pour commencer."
          />
        }
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
