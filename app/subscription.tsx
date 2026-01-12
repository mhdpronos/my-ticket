import { Pressable, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

export default function SubscriptionScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader
        title={t('subscriptionTitle')}
        subtitle={t('subscriptionSubtitle')}
      />
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <ThemedText type="defaultSemiBold">{t('planMonthly')}</ThemedText>
        <ThemedText style={{ color: mutedText }}>{t('planMonthlyDetail')}</ThemedText>
        <ThemedText type="subtitle">9 900 FCFA</ThemedText>
        <Pressable style={[styles.primaryButton, { backgroundColor: tint }]}>
          <ThemedText style={styles.primaryButtonText}>{t('buttonChoosePlan')}</ThemedText>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <ThemedText type="defaultSemiBold">{t('planAnnual')}</ThemedText>
        <ThemedText style={{ color: mutedText }}>{t('planAnnualDetail')}</ThemedText>
        <ThemedText type="subtitle">99 000 FCFA</ThemedText>
        <Pressable style={[styles.primaryButton, { backgroundColor: tint }]}>
          <ThemedText style={styles.primaryButtonText}>{t('buttonChoosePlan')}</ThemedText>
        </Pressable>
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
  primaryButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
