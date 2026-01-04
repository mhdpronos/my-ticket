import { ScrollView, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useUserAccess } from '@/hooks/use-user-access';

// Profile screen with subscription and performance placeholders.

export default function ProfileScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const { isPremium } = useUserAccess();

  return (
    <ScrollView style={[styles.container, { backgroundColor: background }]} contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <ThemedText type="title">Profil</ThemedText>
        <ThemedText style={{ color: mutedText }}>Créée par MHD Pronos</ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="shield-account-outline" size={20} color={mutedText} />
          <ThemedText type="defaultSemiBold">Statut</ThemedText>
        </View>
        <ThemedText style={{ color: mutedText }}>{isPremium ? 'Premium actif' : 'Compte gratuit'}</ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="chart-line" size={20} color={mutedText} />
          <ThemedText type="defaultSemiBold">Performances</ThemedText>
        </View>
        <ThemedText style={{ color: mutedText }}>Taux de réussite: 0%</ThemedText>
        <ThemedText style={{ color: mutedText }}>Série en cours: 0</ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="cog-outline" size={20} color={mutedText} />
          <ThemedText type="defaultSemiBold">Paramètres</ThemedText>
        </View>
        <ThemedText style={{ color: mutedText }}>Notifications • Langue • Thème</ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },
  header: {
    gap: 6,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
