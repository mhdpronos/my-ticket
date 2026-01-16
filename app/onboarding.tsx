import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { BrandTitle } from '@/components/ui/BrandTitle';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

export default function OnboardingScreen() {
  const background = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');
  const mutedText = useThemeColor({}, 'mutedText');
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: background }]}> 
      <View style={styles.content}>
        <BrandTitle accessibilityLabel={t('appName')} />
        <ThemedText style={[styles.subtitle, { color: mutedText }]}>
          {t('onboardingTagline')}
        </ThemedText>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace('/matches')}
        style={[styles.primaryButton, { backgroundColor: tint }]}>
        <ThemedText style={styles.primaryButtonText}>{t('buttonStart')}</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 24,
  },
  content: {
    gap: 10,
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
