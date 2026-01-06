import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { TexteTheme } from '@/composants/texte-theme';
import { useCouleurTheme } from '@/crochets/utiliser-couleur-theme';
import { Prediction } from '@/types/domaine';

// Ligne de pronostic avec action d'ajout au ticket.

type ElementPredictionProps = {
  prediction: Prediction;
  locked: boolean;
  onAdd: () => void;
};

export function ElementPrediction({ prediction, locked, onAdd }: ElementPredictionProps) {
  const border = useCouleurTheme({}, 'border');
  const mutedText = useCouleurTheme({}, 'mutedText');
  const premium = useCouleurTheme({}, 'premium');

  return (
    <View style={[styles.row, { borderColor: border, opacity: locked ? 0.5 : 1 }]}>
      <View style={styles.info}>
        <TexteTheme type="defaultSemiBold">{prediction.label}</TexteTheme>
        <View style={styles.metaRow}>
          <TexteTheme style={{ color: mutedText }}>{prediction.market}</TexteTheme>
          <TexteTheme style={{ color: mutedText }}>Confiance {prediction.confidence}/5</TexteTheme>
          <TexteTheme style={{ color: prediction.tier === 'premium' ? premium : mutedText }}>
            {prediction.tier === 'premium' ? 'Premium' : 'Gratuit'}
          </TexteTheme>
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
