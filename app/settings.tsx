import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

const rows = [
  { id: 'lang', label: 'Langue', value: 'Français', icon: 'translate' },
  { id: 'theme', label: 'Thème', value: 'Sombre', icon: 'weather-night' },
  { id: 'security', label: 'Sécurité', value: '2FA activée', icon: 'shield-check-outline' },
];

export default function SettingsScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <ThemedText type="title">Réglages</ThemedText>
        <ThemedText style={{ color: mutedText }}>Personnalise ton expérience MY TICKET.</ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        {rows.map((row) => (
          <Pressable key={row.id} style={[styles.rowButton, { borderColor: border }]}>
            <View style={styles.rowContent}>
              <MaterialCommunityIcons name={row.icon as any} size={18} color={tint} />
              <View>
                <ThemedText>{row.label}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{row.value}</ThemedText>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  header: {
    gap: 6,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  rowButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
