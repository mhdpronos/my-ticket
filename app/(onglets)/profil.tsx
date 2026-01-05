import { ScrollView, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { TexteTheme } from '@/composants/texte-theme';
import { useCouleurTheme } from '@/crochets/utiliser-couleur-theme';
import { useAccesUtilisateur } from '@/crochets/utiliser-acces-utilisateur';

// Écran profil avec espaces réservés pour l'abonnement et les performances.

export default function EcranProfil() {
  const background = useCouleurTheme({}, 'background');
  const backgroundSecondary = useCouleurTheme({}, 'backgroundSecondary');
  const card = useCouleurTheme({}, 'card');
  const border = useCouleurTheme({}, 'border');
  const mutedText = useCouleurTheme({}, 'mutedText');
  const success = useCouleurTheme({}, 'success');
  const warning = useCouleurTheme({}, 'warning');
  const premium = useCouleurTheme({}, 'premium');
  const { isPremium } = useAccesUtilisateur();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: background }]}
      contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.identityRow}>
          <View style={[styles.avatar, { backgroundColor: backgroundSecondary, borderColor: border }]}>
            <MaterialCommunityIcons name="account-outline" size={30} color={mutedText} />
          </View>
          <View style={styles.identityText}>
            <TexteTheme type="title">Profil professionnel</TexteTheme>
            <TexteTheme style={{ color: mutedText }}>Compte Pro • MHD Pronos</TexteTheme>
          </View>
        </View>
        <View style={[styles.progressCard, { backgroundColor: card, borderColor: border }]}>
          <View style={styles.progressHeader}>
            <TexteTheme type="defaultSemiBold">Profil complété</TexteTheme>
            <TexteTheme style={{ color: mutedText }}>85%</TexteTheme>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: backgroundSecondary }]}>
            <View style={[styles.progressValue, { backgroundColor: premium }]} />
          </View>
          <TexteTheme style={{ color: mutedText }}>
            Ajoute ton numéro de contact pour activer le support prioritaire.
          </TexteTheme>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="shield-account-outline" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Identité & accès</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Nom</TexteTheme>
          <TexteTheme style={styles.rowValue}>MHD Pro Analyst</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Email</TexteTheme>
          <TexteTheme style={styles.rowValue}>pro@mhdpronos.com</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Téléphone</TexteTheme>
          <TexteTheme style={styles.rowValue}>+225 07 00 00 00 00</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>ID client</TexteTheme>
          <TexteTheme style={styles.rowValue}>PRO-1042</TexteTheme>
        </View>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { borderColor: border, backgroundColor: backgroundSecondary }]}>
            <MaterialCommunityIcons name="check-decagram-outline" size={14} color={success} />
            <TexteTheme style={{ color: mutedText }}>Identité vérifiée</TexteTheme>
          </View>
          <View style={[styles.badge, { borderColor: border, backgroundColor: backgroundSecondary }]}>
            <MaterialCommunityIcons name="shield-lock-outline" size={14} color={success} />
            <TexteTheme style={{ color: mutedText }}>2FA activée</TexteTheme>
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="crown-outline" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Abonnement & facturation</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Plan</TexteTheme>
          <TexteTheme style={[styles.rowValue, { color: premium }]}>
            {isPremium ? 'Premium actif' : 'Compte gratuit'}
          </TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Renouvellement</TexteTheme>
          <TexteTheme style={styles.rowValue}>28 Oct 2024</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Méthode</TexteTheme>
          <TexteTheme style={styles.rowValue}>Mobile Money •**** 2241</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Factures</TexteTheme>
          <TexteTheme style={styles.rowValue}>Dernière facture: 29 Sept 2024</TexteTheme>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="chart-line" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Performances pro</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Taux de réussite</TexteTheme>
          <TexteTheme style={[styles.rowValue, { color: success }]}>72%</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>ROI moyen</TexteTheme>
          <TexteTheme style={[styles.rowValue, { color: success }]}>+18%</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Cotes moyennes</TexteTheme>
          <TexteTheme style={styles.rowValue}>1.85</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Série en cours</TexteTheme>
          <TexteTheme style={styles.rowValue}>6 victoires</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Tickets publiés</TexteTheme>
          <TexteTheme style={styles.rowValue}>128</TexteTheme>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="timeline-text-outline" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Activité récente</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Dernier ticket</TexteTheme>
          <TexteTheme style={styles.rowValue}>Ligue 1 • PSG vs OM</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Connexion</TexteTheme>
          <TexteTheme style={styles.rowValue}>Aujourd’hui, 09:42</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Alertes actives</TexteTheme>
          <TexteTheme style={styles.rowValue}>Cotes boostées (3)</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Risque</TexteTheme>
          <TexteTheme style={[styles.rowValue, { color: warning }]}>Surveillance bankroll</TexteTheme>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="cog-outline" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Préférences & outils</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Notifications</TexteTheme>
          <TexteTheme style={styles.rowValue}>Push • Email • WhatsApp</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Langue</TexteTheme>
          <TexteTheme style={styles.rowValue}>Français</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Fuseau horaire</TexteTheme>
          <TexteTheme style={styles.rowValue}>GMT +0 (Abidjan)</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Bookmakers</TexteTheme>
          <TexteTheme style={styles.rowValue}>1xBet • Betwinner • Melbet</TexteTheme>
        </View>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { borderColor: border, backgroundColor: backgroundSecondary }]}>
            <MaterialCommunityIcons name="file-chart-outline" size={14} color={mutedText} />
            <TexteTheme style={{ color: mutedText }}>Rapports automatiques</TexteTheme>
          </View>
          <View style={[styles.badge, { borderColor: border, backgroundColor: backgroundSecondary }]}>
            <MaterialCommunityIcons name="cloud-download-outline" size={14} color={mutedText} />
            <TexteTheme style={{ color: mutedText }}>Export CSV</TexteTheme>
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="headset" size={20} color={mutedText} />
          <TexteTheme type="defaultSemiBold">Support professionnel</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Gestionnaire</TexteTheme>
          <TexteTheme style={styles.rowValue}>Equipe Success Pro</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Disponibilité</TexteTheme>
          <TexteTheme style={styles.rowValue}>24/7 • Prioritaire</TexteTheme>
        </View>
        <View style={styles.row}>
          <TexteTheme style={[styles.rowLabel, { color: mutedText }]}>Canal</TexteTheme>
          <TexteTheme style={styles.rowValue}>WhatsApp +225 05 00 00 00 00</TexteTheme>
        </View>
        <View style={styles.quickActions}>
          <View style={[styles.actionChip, { borderColor: border, backgroundColor: backgroundSecondary }]}>
            <MaterialCommunityIcons name="calendar-check-outline" size={14} color={mutedText} />
            <TexteTheme style={{ color: mutedText }}>Planifier un call</TexteTheme>
          </View>
          <View style={[styles.actionChip, { borderColor: border, backgroundColor: backgroundSecondary }]}>
            <MaterialCommunityIcons name="message-text-outline" size={14} color={mutedText} />
            <TexteTheme style={{ color: mutedText }}>Envoyer un message</TexteTheme>
          </View>
          <View style={[styles.actionChip, { borderColor: border, backgroundColor: backgroundSecondary }]}>
            <MaterialCommunityIcons name="file-document-outline" size={14} color={mutedText} />
            <TexteTheme style={{ color: mutedText }}>Ouvrir un ticket</TexteTheme>
          </View>
        </View>
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
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: {
    flex: 1,
    gap: 4,
  },
  progressCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressValue: {
    width: '85%',
    height: '100%',
    borderRadius: 999,
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
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  rowLabel: {
    flex: 1,
  },
  rowValue: {
    flex: 1,
    textAlign: 'right',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
});
