import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

export default function SupportScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title={t('supportTitle')} subtitle={t('supportSubtitle')} />
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/support-contact')}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: pressed ? background : card, borderColor: border },
        ]}>
        <MaterialCommunityIcons name="headset" size={22} color={mutedText} />
        <View style={styles.textBlock}>
          <ThemedText type="defaultSemiBold">{t('supportContactTitle')}</ThemedText>
          <ThemedText style={{ color: mutedText }}>{t('supportContactBody')}</ThemedText>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/support-faq')}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: pressed ? background : card, borderColor: border },
        ]}>
        <MaterialCommunityIcons name="help-circle-outline" size={22} color={mutedText} />
        <View style={styles.textBlock}>
          <ThemedText type="defaultSemiBold">{t('supportFaqTitle')}</ThemedText>
          <ThemedText style={{ color: mutedText }}>{t('supportFaqBody')}</ThemedText>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/about')}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: pressed ? background : card, borderColor: border },
        ]}>
        <MaterialCommunityIcons name="information-outline" size={22} color={mutedText} />
        <View style={styles.textBlock}>
          <ThemedText type="defaultSemiBold">{t('supportAboutTitle')}</ThemedText>
          <ThemedText style={{ color: mutedText }}>{t('supportAboutBody')}</ThemedText>
        </View>
      </Pressable>
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
    gap: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
});
