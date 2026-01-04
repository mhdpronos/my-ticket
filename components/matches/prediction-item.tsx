import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Prediction } from '@/types/domain';

// Single prediction row with add-to-ticket action.

type PredictionItemProps = {
  prediction: Prediction;
  locked: boolean;
  onAdd: () => void;
};

export function PredictionItem({ prediction, locked, onAdd }: PredictionItemProps) {
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const premium = useThemeColor({}, 'premium');

  return (
    <View style={[styles.row, { borderColor: border, opacity: locked ? 0.5 : 1 }]}>
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold">{prediction.label}</ThemedText>
        <View style={styles.metaRow}>
          <ThemedText style={{ color: mutedText }}>{prediction.market}</ThemedText>
          <ThemedText style={{ color: mutedText }}>Confidence {prediction.confidence}/5</ThemedText>
          <ThemedText style={{ color: prediction.tier === 'premium' ? premium : mutedText }}>
            {prediction.tier === 'premium' ? 'Premium' : 'Gratuit'}
          </ThemedText>
        </View>
      </View>
      <TouchableOpacity style={[styles.addButton, { borderColor: border }]} onPress={onAdd} disabled={locked}>
        <MaterialCommunityIcons name="plus" size={20} color={locked ? mutedText : premium} />
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
    gap: 10,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
