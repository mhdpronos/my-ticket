import { ScrollView, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { TexteTheme } from '@/composants/texte-theme';
import { useCouleurTheme } from '@/crochets/utiliser-couleur-theme';
import { useAccesUtilisateur } from '@/crochets/utiliser-acces-utilisateur';

// Écran profil avec espaces réservés pour l'abonnement et les performances.

export default function EcranProfil() {
  const background = useCouleurTheme({}, 'background');
  const card = useCouleurTheme({}, 'card');
  const border = useCouleurTheme({}, 'border');
  const mutedText = useCouleurTheme({}, 'mutedText');
  const { isPremium } = useAccesUtilisateur();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: background }]}
      contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TexteTheme type="title">Profil</TexteTheme>
        <TexteTheme style={{ color: mutedText }}>Créé par MHD Pronos</TexteTheme>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="shield-account-outline" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Statut</TexteTheme>
        </View>
        <TexteTheme style={{ color: mutedText }}>{isPremium ? 'Premium actif' : 'Compte gratuit'}</TexteTheme>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="chart-line" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Performances</TexteTheme>
        </View>
        <TexteTheme style={{ color: mutedText }}>Taux de réussite: 0%</TexteTheme>
        <TexteTheme style={{ color: mutedText }}>Série en cours: 0</TexteTheme>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="cog-outline" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Paramètres</TexteTheme>
        </View>
        <TexteTheme style={{ color: mutedText }}>Notifications • Langue • Thème</TexteTheme>
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
