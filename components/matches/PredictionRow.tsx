import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { Prediction } from '@/types';

type PredictionRowProps = {
  prediction: Prediction;
  locked: boolean;
  onAdd: () => void;
  oddsLabel?: string;
  isAdded?: boolean;
};

const selectionLabels: Record<Prediction['selection'], string> = {
  HOME: 'V1',
  DRAW: 'X',
  AWAY: 'V2',
  OVER: '+',
  UNDER: '-',
  YES: 'Oui',
  NO: 'Non',
};

const marketLabels: Record<Prediction['market'], string> = {
  '1X2': '1X2',
  OVER_UNDER: 'O/U',
  BOTH_TEAMS_SCORE: 'BTTS',
  DOUBLE_CHANCE: 'DC',
  HANDICAP: 'Handicap',
};

export function PredictionRow({
  prediction,
  locked,
  onAdd,
  oddsLabel = '—',
  isAdded = false,
}: PredictionRowProps) {
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const premium = useThemeColor({}, 'premium');
  const accent = useThemeColor({}, 'accent');
  const success = useThemeColor({}, 'success');
  const { t } = useTranslation();

  const riskLabels: Record<Prediction['risk'], string> = {
    safe: t('riskSafe'),
    medium: t('riskMedium'),
    risky: t('riskRisky'),
  };

  const handleAdd = () => {
    if (locked) {
      return;
    }
    onAdd();
  };

  const buttonLabel = isAdded ? t('ticketAdded') : t('ticketAdd');
  const buttonColor = isAdded ? success : accent;
  const selectionLabel = prediction.selectionLabel ?? selectionLabels[prediction.selection];
  const predictionTitle = `${marketLabels[prediction.market]}: ${selectionLabel}`;

  return (
    <View style={[styles.row, { borderColor: border, opacity: locked ? 0.5 : 1 }]}>
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {predictionTitle}
        </ThemedText>
        <ThemedText style={{ color: mutedText }}>{t('ticketOddsLabel', { value: oddsLabel })}</ThemedText>
        <View style={styles.metaRow}>
          <View style={[styles.tag, { borderColor: border }]}>
            <ThemedText style={{ color: mutedText }}>{prediction.market}</ThemedText>
          </View>
          <View style={[styles.tag, { borderColor: border }]}>
            <ThemedText style={{ color: mutedText }}>{riskLabels[prediction.risk]}</ThemedText>
          </View>
          <View style={[styles.tag, { borderColor: border }]}>
            <ThemedText style={{ color: prediction.tier === 'premium' ? premium : mutedText }}>
              {prediction.tier === 'premium' ? t('tierPremium') : t('tierFree')}
            </ThemedText>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.addButton,
          {
            borderColor: isAdded ? success : border,
            backgroundColor: isAdded ? success : 'transparent',
          },
        ]}
        onPress={handleAdd}
        disabled={locked}
        accessibilityRole="button">
        {isAdded ? (
          <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
        ) : (
          <MaterialCommunityIcons name="plus" size={18} color={locked ? mutedText : buttonColor} />
        )}
        <ThemedText style={{ color: locked ? mutedText : isAdded ? '#FFFFFF' : buttonColor }}>
          {buttonLabel}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
});
