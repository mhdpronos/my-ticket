import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ElementPrediction } from '@/composants/rencontres/element-prediction';
import { TexteTheme } from '@/composants/texte-theme';
import { useCouleurTheme } from '@/crochets/utiliser-couleur-theme';
import { useAccesUtilisateur } from '@/crochets/utiliser-acces-utilisateur';
import { Match } from '@/types/domaine';

// Feuille du bas qui affiche les pronostics d'un match.

type FeuilleBasRencontreProps = {
  match: Match | null;
  visible: boolean;
  onClose: () => void;
  onAddPrediction: (match: Match, predictionId: string) => void;
};

export function FeuilleBasRencontre({ match, visible, onClose, onAddPrediction }: FeuilleBasRencontreProps) {
  const card = useCouleurTheme({}, 'card');
  const border = useCouleurTheme({}, 'border');
  const mutedText = useCouleurTheme({}, 'mutedText');
  const { isPremium } = useAccesUtilisateur();

  if (!match) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: card, borderColor: border }]}>
          <View style={styles.header}>
            <View>
              <TexteTheme type="subtitle">
                {match.homeTeam} - {match.awayTeam}
              </TexteTheme>
              <TexteTheme style={{ color: mutedText }}>
                {match.league} • {new Date(match.kickoffIso).toLocaleString('fr-FR')}
              </TexteTheme>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { borderColor: border }]}>
              <MaterialCommunityIcons name="close" size={18} color={mutedText} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={styles.sectionHeader}>
              <TexteTheme type="defaultSemiBold">Pronostics disponibles</TexteTheme>
              <TexteTheme style={{ color: mutedText }}>{isPremium ? 'Premium actif' : 'Mode gratuit'}</TexteTheme>
            </View>

            {match.predictions.map((prediction) => {
              const locked = prediction.tier === 'premium' && !isPremium;
              return (
                <ElementPrediction
                  key={prediction.id}
                  prediction={prediction}
                  locked={locked}
                  onAdd={() => onAddPrediction(match, prediction.id)}
                />
              );
            })}

            {!isPremium && (
              <View style={[styles.premiumBanner, { borderColor: border }]}>
                <TexteTheme type="defaultSemiBold">Passe en Premium</TexteTheme>
                <TexteTheme style={{ color: mutedText }}>
                  Débloque 3 pronostics supplémentaires par match et les meilleures cotes.
                </TexteTheme>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '85%',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  closeButton: {
    borderWidth: 1,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: 12,
  },
  sectionHeader: {
    gap: 4,
  },
  premiumBanner: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
});
