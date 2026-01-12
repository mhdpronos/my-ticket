import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

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
        <ThemedText type="title">{t('appName')}</ThemedText>
        <ThemedText style={{ color: mutedText }}>
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
