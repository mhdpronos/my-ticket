import { FlatList, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ThemedText } from '@/components/ui/ThemedText';
import { leagues } from '@/data/leagues';
import { teams } from '@/data/teams';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppStore } from '@/store/useAppStore';

export default function FavoritesScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');

  const favoriteTeams = useAppStore((state) => state.favoriteTeams);
  const favoriteLeagues = useAppStore((state) => state.favoriteLeagues);

  const favoriteTeamItems = teams.filter((team) => favoriteTeams.includes(team.id));
  const favoriteLeagueItems = leagues.filter((league) => favoriteLeagues.includes(league.id));

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <ThemedText type="title">Favoris</ThemedText>
        <ThemedText style={{ color: mutedText }}>Tes équipes et ligues suivies.</ThemedText>
      </View>

      <View style={[styles.section, { backgroundColor: card, borderColor: border }]}>
        <ThemedText type="defaultSemiBold">Équipes favorites</ThemedText>
        <FlatList
          data={favoriteTeamItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <MaterialCommunityIcons name="star" size={16} color={mutedText} />
              <ThemedText>{item.name}</ThemedText>
            </View>
          )}
          ListEmptyComponent={<ThemedText style={{ color: mutedText }}>Aucune équipe suivie.</ThemedText>}
        />
      </View>

      <View style={[styles.section, { backgroundColor: card, borderColor: border }]}>
        <ThemedText type="defaultSemiBold">Ligues favorites</ThemedText>
        <FlatList
          data={favoriteLeagueItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <MaterialCommunityIcons name="star" size={16} color={mutedText} />
              <ThemedText>{item.name}</ThemedText>
            </View>
          )}
          ListEmptyComponent={<ThemedText style={{ color: mutedText }}>Aucune ligue suivie.</ThemedText>}
        />
      </View>

      {favoriteTeams.length === 0 && favoriteLeagues.length === 0 && (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="star-circle-outline" size={48} color={mutedText} />
          <ThemedText type="defaultSemiBold">Aucun favori pour le moment</ThemedText>
          <ThemedText style={{ color: mutedText }}>Ajoute des équipes depuis la page Matchs.</ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 16,
    gap: 16,
  },
  header: {
    gap: 6,
  },
  section: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
