import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';

import { PredictionRow } from '@/components/matches/PredictionRow';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Match, Prediction, UserAccess } from '@/types';

type MatchBottomSheetProps = {
  match: Match | null;
  visible: boolean;
  predictions: Prediction[];
  userAccess: UserAccess;
  onClose: () => void;
  onAddPrediction: (match: Match, prediction: Prediction) => void;
};

export function MatchBottomSheet({
  match,
  visible,
  predictions,
  userAccess,
  onClose,
  onAddPrediction,
}: MatchBottomSheetProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');

  const snapPoints = useMemo(() => ['60%', '85%'], []);

  useEffect(() => {
    if (visible && match) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible, match]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    []
  );

  if (!match) {
    return null;
  }

  const isPremium = userAccess.status === 'PREMIUM';
  const freePredictions = predictions.filter((prediction) => prediction.tier === 'free');
  const premiumPredictions = predictions.filter((prediction) => prediction.tier === 'premium');
  const visiblePredictions = isPremium ? [...freePredictions, ...premiumPredictions] : freePredictions;

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: card }}
      handleIndicatorStyle={{ backgroundColor: border }}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <ThemedText type="subtitle">
              {match.homeTeam.name} - {match.awayTeam.name}
            </ThemedText>
            <ThemedText style={{ color: mutedText }}>
              {match.league.name} • {new Date(match.kickoffIso).toLocaleString('fr-FR')}
            </ThemedText>
          </View>
          <TouchableOpacity onPress={handleDismiss} style={[styles.closeButton, { borderColor: border }]}>
            <MaterialCommunityIcons name="close" size={18} color={mutedText} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText type="defaultSemiBold">Pronostics disponibles</ThemedText>
          <ThemedText style={{ color: mutedText }}>{isPremium ? 'Premium actif' : 'Mode gratuit'}</ThemedText>
        </View>

        {visiblePredictions.length === 0 ? (
          <ThemedText style={{ color: mutedText }}>Chargement des pronostics...</ThemedText>
        ) : (
          visiblePredictions.map((prediction) => (
            <PredictionRow
              key={prediction.id}
              prediction={prediction}
              locked={prediction.tier === 'premium' && !isPremium}
              onAdd={() => onAddPrediction(match, prediction)}
            />
          ))
        )}

        {!isPremium && (
          <View style={[styles.premiumBanner, { borderColor: border }]}>
            <ThemedText type="defaultSemiBold">Passe en Premium</ThemedText>
            <ThemedText style={{ color: mutedText }}>
              Débloque 3 pronostics supplémentaires par match et les meilleures cotes.
            </ThemedText>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.push('/subscription')}
              style={[styles.upgradeButton, { backgroundColor: tint }]}>
              <ThemedText style={styles.upgradeButtonText}>Passer Premium</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  closeButton: {
    borderWidth: 1,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    gap: 4,
  },
  premiumBanner: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  upgradeButton: {
    marginTop: 4,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
