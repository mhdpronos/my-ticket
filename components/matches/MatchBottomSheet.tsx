// Le code qui affiche la fiche détaillée d'un match en bottom sheet.
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
  const warning = useThemeColor({}, 'warning');
  const accent = useThemeColor({}, 'accent');

  const snapPoints = useMemo(() => ['65%', '92%'], []);

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
  const bookmakers = ['1xBet', 'Betwinner', 'Melbet', 'Bet365'];

  const sections = [
    { key: 'safe', label: 'Safe', tone: success },
    { key: 'medium', label: 'Medium', tone: warning },
    { key: 'risky', label: 'Risky', tone: danger },
  ] as const;

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: card }}
      handleIndicatorStyle={{ backgroundColor: border }}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.matchHeader}>
            <View style={styles.teamLine}>
              <Image source={{ uri: match.homeTeam.logoUrl }} style={styles.logo} contentFit="contain" />
              <ThemedText type="defaultSemiBold" numberOfLines={1}>
                {match.homeTeam.name}
              </ThemedText>
            </View>
            <View style={[styles.scoreBox, { borderColor: border }]}> 
              <ThemedText type="title" style={{ color: tint }}>
                {scoreLabel}
              </ThemedText>
              <View style={[styles.statusPill, { backgroundColor: match.status === 'live' ? danger : accent }]}> 
                <ThemedText style={styles.statusPillText}>
                  {match.status === 'live'
                    ? `LIVE ${match.liveMinute ?? 0}'`
                    : match.status === 'finished'
                    ? 'FT'
                    : 'À venir'}
                </ThemedText>
              </View>
            </View>
            <View style={styles.teamLineRight}>
              <ThemedText type="defaultSemiBold" numberOfLines={1}>
                {match.awayTeam.name}
              </ThemedText>
              <Image source={{ uri: match.awayTeam.logoUrl }} style={styles.logo} contentFit="contain" />
            </View>
          </View>
          <TouchableOpacity onPress={handleDismiss} style={[styles.closeButton, { borderColor: border }]}>
            <MaterialCommunityIcons name="close" size={18} color={mutedText} />
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <ThemedText style={{ color: mutedText }} numberOfLines={1}>
            {match.league.name} • {new Date(match.kickoffIso).toLocaleString('fr-FR')}
          </ThemedText>
          <ThemedText style={{ color: mutedText }} numberOfLines={1}>
            {match.venue ?? '—'}
          </ThemedText>
        </View>

        {winRate ? (
          <View style={[styles.winRateCard, { borderColor: border }]}> 
            <View style={styles.winRateRow}>
              <ThemedText type="defaultSemiBold">Forme estimée</ThemedText>
              <View style={styles.winRateSplit}>
                <ThemedText style={{ color: winRate.home >= 60 ? success : danger }}>
                  {match.homeTeam.name} {winRate.home}%
                </ThemedText>
                <ThemedText style={{ color: mutedText }}>{winRate.draw}% nul</ThemedText>
                <ThemedText style={{ color: winRate.away >= 60 ? success : danger }}>
                  {match.awayTeam.name} {winRate.away}%
                </ThemedText>
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
          <ThemedText type="defaultSemiBold">Pronostics</ThemedText>
          <ThemedText style={{ color: mutedText }}>{isPremium ? 'Premium actif' : 'Mode gratuit'}</ThemedText>
        </View>

        {visiblePredictions.length === 0 ? (
          <ThemedText style={{ color: mutedText }}>Chargement des pronostics...</ThemedText>
        ) : (
          sections.map((section) => {
            const sectionPredictions = visiblePredictions.filter((prediction) => prediction.risk === section.key);
            return (
              <View key={section.key} style={styles.riskSection}>
                <View style={styles.riskHeader}>
                  <View style={[styles.riskDot, { backgroundColor: section.tone }]} />
                  <ThemedText type="defaultSemiBold">{section.label}</ThemedText>
                  <ThemedText style={{ color: mutedText }}>{sectionPredictions.length} pronos</ThemedText>
                </View>
                {sectionPredictions.length === 0 ? (
                  <ThemedText style={{ color: mutedText }}>Aucun prono disponible.</ThemedText>
                ) : (
                  sectionPredictions.map((prediction) => (
                    <PredictionRow
                      key={prediction.id}
                      prediction={prediction}
                      locked={prediction.tier === 'premium' && !isPremium}
                      onAdd={() => onAddPrediction(match, prediction)}
                      oddsLabel="—"
                    />
                  ))
                )}
              </View>
            );
          })
        )}

        <View style={styles.sectionHeader}>
          <ThemedText type="defaultSemiBold">Parier avec</ThemedText>
          <ThemedText style={{ color: mutedText }}>Bookmakers partenaires</ThemedText>
        </View>
        <View style={styles.bookmakersRow}>
          {bookmakers.map((bookmaker) => (
            <TouchableOpacity
              key={bookmaker}
              accessibilityRole="button"
              style={[styles.bookmakerChip, { borderColor: border }]}
              onPress={() => {}}>
              <ThemedText style={{ color: mutedText }}>{bookmaker}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

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
      </ScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 16,
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
    alignItems: 'center',
    gap: 8,
  },
  teamLineRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
  },
  scoreBox: {
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: {
    color: '#FFFFFF',
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
  riskSection: {
    gap: 8,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  riskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bookmakersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bookmakerChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
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
