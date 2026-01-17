import { StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

export default function AboutScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title={t('aboutTitle')} subtitle={t('aboutSubtitle')} />
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <ThemedText type="defaultSemiBold">{t('aboutCardTitle')}</ThemedText>
        <ThemedText style={{ color: mutedText }}>{t('aboutCardBody')}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
});
