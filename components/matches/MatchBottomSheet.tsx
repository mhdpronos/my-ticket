// Le code qui affiche la fiche détaillée d'un match en bottom sheet.
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
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
  const success = useThemeColor({}, 'success');
  const danger = useThemeColor({}, 'danger');

  const snapPoints = useMemo(() => ['65%', '90%'], []);

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
  const scoreLabel = match.score ? `${match.score.home} : ${match.score.away}` : '-- : --';
  const winRate = match.winRate;

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
          <View style={styles.matchHeader}>
            <View style={styles.teamLine}>
              <Image source={{ uri: match.homeTeam.logoUrl }} style={styles.logo} contentFit="contain" />
              <ThemedText type="defaultSemiBold">{match.homeTeam.name}</ThemedText>
            </View>
            <View style={styles.scoreBox}>
              <ThemedText type="title" style={{ color: tint }}>
                {scoreLabel}
              </ThemedText>
              <ThemedText style={{ color: mutedText }}>
                {match.status === 'live' ? `LIVE ${match.liveMinute ?? 0}'` : match.status === 'finished' ? 'Terminé' : 'À venir'}
              </ThemedText>
            </View>
            <View style={styles.teamLine}>
              <ThemedText type="defaultSemiBold">{match.awayTeam.name}</ThemedText>
              <Image source={{ uri: match.awayTeam.logoUrl }} style={styles.logo} contentFit="contain" />
            </View>
          </View>
          <TouchableOpacity onPress={handleDismiss} style={[styles.closeButton, { borderColor: border }]}>
            <MaterialCommunityIcons name="close" size={18} color={mutedText} />
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <ThemedText style={{ color: mutedText }}>
            {match.league.name} • {new Date(match.kickoffIso).toLocaleString('fr-FR')}
          </ThemedText>
          <ThemedText style={{ color: mutedText }}>{match.venue ?? 'Stade principal'}</ThemedText>
        </View>

        <View style={[styles.winRateCard, { borderColor: border }]}> 
          <View style={styles.winRateRow}>
            <ThemedText type="defaultSemiBold">Taux de réussite</ThemedText>
            {winRate && (
              <View style={styles.winRateSplit}>
                <ThemedText style={{ color: winRate.home >= 60 ? success : danger }}>
                  {match.homeTeam.name} {winRate.home}%
                </ThemedText>
                <ThemedText style={{ color: mutedText }}>{winRate.draw}% nul</ThemedText>
                <ThemedText style={{ color: winRate.away >= 60 ? success : danger }}>
                  {match.awayTeam.name} {winRate.away}%
                </ThemedText>
              </View>
            )}
          </View>
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
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  matchHeader: {
    flex: 1,
    gap: 12,
  },
  teamLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
  },
  scoreBox: {
    alignItems: 'center',
    gap: 2,
  },
  closeButton: {
    borderWidth: 1,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    gap: 4,
  },
  winRateCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 6,
  },
  winRateRow: {
    gap: 6,
  },
  winRateSplit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
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
