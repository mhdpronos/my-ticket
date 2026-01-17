import { Linking, Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

const WHATSAPP_NUMBER = '+2250574489226';
const EMAIL_ADDRESS = 'contact@mhdpronos.com';
const WHATSAPP_URL = 'https://wa.me/2250574489226';
const EMAIL_URL = 'mailto:contact@mhdpronos.com';

export default function SupportContactScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title={t('supportContactPageTitle')} subtitle={t('supportContactPageSubtitle')} />
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <ThemedText type="defaultSemiBold">{t('supportContactIntroTitle')}</ThemedText>
        <ThemedText style={{ color: mutedText }}>{t('supportContactIntroBody')}</ThemedText>
        <View style={styles.contactRow}>
          <MaterialCommunityIcons name="whatsapp" size={18} color={mutedText} />
          <ThemedText style={{ color: mutedText }}>{WHATSAPP_NUMBER}</ThemedText>
        </View>
        <View style={styles.contactRow}>
          <MaterialCommunityIcons name="email-outline" size={18} color={mutedText} />
          <ThemedText style={{ color: mutedText }}>{EMAIL_ADDRESS}</ThemedText>
        </View>
      </View>
      <View style={styles.buttonStack}>
        <Pressable
          accessibilityRole="button"
          onPress={() => Linking.openURL(WHATSAPP_URL)}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: tint, opacity: pressed ? 0.9 : 1 },
          ]}>
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="whatsapp" size={18} color="#FFFFFF" />
            <ThemedText style={styles.primaryButtonText}>{t('supportContactWhatsapp')}</ThemedText>
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => Linking.openURL(EMAIL_URL)}
          style={({ pressed }) => [
            styles.secondaryButton,
            { borderColor: border, opacity: pressed ? 0.9 : 1 },
          ]}>
          <View style={styles.buttonContent}>
            <MaterialCommunityIcons name="email-outline" size={18} color={tint} />
            <ThemedText style={{ color: tint }}>{t('supportContactEmail')}</ThemedText>
          </View>
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
    gap: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonStack: {
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
