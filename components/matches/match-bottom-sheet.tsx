import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { PredictionItem } from '@/components/matches/prediction-item';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useUserAccess } from '@/hooks/use-user-access';
import { Match } from '@/types/domain';

// Bottom sheet that shows predictions for a match.

type MatchBottomSheetProps = {
  match: Match | null;
  visible: boolean;
  onClose: () => void;
  onAddPrediction: (match: Match, predictionId: string) => void;
};

export function MatchBottomSheet({ match, visible, onClose, onAddPrediction }: MatchBottomSheetProps) {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const { isPremium } = useUserAccess();

  if (!match) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: card, borderColor: border }]}
        >
          <View style={styles.header}>
            <View>
              <ThemedText type="subtitle">{match.homeTeam} - {match.awayTeam}</ThemedText>
              <ThemedText style={{ color: mutedText }}>
                {match.league} • {new Date(match.kickoffIso).toLocaleString('fr-FR')}
              </ThemedText>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { borderColor: border }]}>
              <MaterialCommunityIcons name="close" size={18} color={mutedText} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={styles.sectionHeader}>
              <ThemedText type="defaultSemiBold">Pronostics disponibles</ThemedText>
              <ThemedText style={{ color: mutedText }}>{isPremium ? 'Premium actif' : 'Mode gratuit'}</ThemedText>
            </View>

            {match.predictions.map((prediction) => {
              const locked = prediction.tier === 'premium' && !isPremium;
              return (
                <PredictionItem
                  key={prediction.id}
                  prediction={prediction}
                  locked={locked}
                  onAdd={() => onAddPrediction(match, prediction.id)}
                />
              );
            })}

            {!isPremium && (
              <View style={[styles.premiumBanner, { borderColor: border }]}
              >
                <ThemedText type="defaultSemiBold">Passe en Premium</ThemedText>
                <ThemedText style={{ color: mutedText }}>
                  Débloque 3 pronostics supplémentaires par match et les meilleures cotes.
                </ThemedText>
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
