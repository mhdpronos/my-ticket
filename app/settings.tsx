import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  UIManager,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useHapticOnScroll } from '@/hooks/useHapticOnScroll';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';

type ThemeOption = 'system' | 'light' | 'dark' | 'nocturne';

export default function SettingsScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const danger = useThemeColor({}, 'danger');
  const success = useThemeColor({}, 'success');
  const scrollHaptics = useHapticOnScroll();

  const { t, language } = useTranslation();
  const setLanguage = useAppStore((state) => state.setLanguage);
  const themePreference = useAppStore((state) => state.themePreference);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const notificationsEnabled = useAppStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = useAppStore((state) => state.setNotificationsEnabled);
  const twoFactorEnabled = useAppStore((state) => state.twoFactorEnabled);
  const setTwoFactorEnabled = useAppStore((state) => state.setTwoFactorEnabled);
  const appUnlockEnabled = useAppStore((state) => state.appUnlockEnabled);
  const setAppUnlockEnabled = useAppStore((state) => state.setAppUnlockEnabled);
  const loginBiometricEnabled = useAppStore((state) => state.loginBiometricEnabled);
  const setLoginBiometricEnabled = useAppStore((state) => state.setLoginBiometricEnabled);
  const signOut = useAppStore((state) => state.signOut);

  const versionLabel = Constants.expoConfig?.version ?? '1.0.0';
  const biometricMethod = Platform.OS === 'ios' ? t('biometricFaceId') : t('biometricFingerprint');
  const isBiometricSupported = Platform.OS === 'ios' || Platform.OS === 'android';
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  const toggleLogoutConfirm = (nextState?: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLogoutConfirmOpen((prev) => (nextState !== undefined ? nextState : !prev));
  };

  const renderChip = (label: string, active: boolean, onPress: () => void) => (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? tint : card,
          borderColor: active ? tint : border,
        },
      ]}>
      <ThemedText style={{ color: active ? '#FFFFFF' : mutedText }}>{label}</ThemedText>
    </Pressable>
  );

  const renderRow = (props: {
    title: string;
    subtitle?: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    onPress?: () => void;
    trailing?: ReactNode;
  }) => (
    <Pressable
      accessibilityRole="button"
      onPress={props.onPress}
      style={[styles.row, { borderColor: border }]}>
      <View style={styles.rowContent}>
        <View style={[styles.rowIcon, { backgroundColor: background, borderColor: border }]}>
          <MaterialCommunityIcons name={props.icon} size={18} color={tint} />
        </View>
        <View style={styles.rowText}>
          <ThemedText type="defaultSemiBold">{props.title}</ThemedText>
          {props.subtitle ? <ThemedText style={{ color: mutedText }}>{props.subtitle}</ThemedText> : null}
        </View>
      </View>
      {props.trailing ?? <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />}
    </Pressable>
  );

  const renderSelectTrigger = (label: string, onPress: () => void) => (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.selectTrigger, { backgroundColor: card, borderColor: border }]}>
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
      <MaterialCommunityIcons name="chevron-down" size={18} color={mutedText} />
    </Pressable>
  );

  const themeOptions: { id: ThemeOption; label: string }[] = [
    { id: 'light', label: t('settingsThemeLight') },
    { id: 'dark', label: t('settingsThemeDark') },
    { id: 'nocturne', label: t('settingsThemeNocturne') },
    { id: 'system', label: t('settingsThemeSystem') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title={t('settingsTitle')} subtitle={t('settingsSubtitle')} containerStyle={styles.header} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} {...scrollHaptics}>
        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <ThemedText type="defaultSemiBold">{t('settingsPreferences')}</ThemedText>

          <View style={[styles.settingItem, { borderColor: border }]}>
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons name="translate" size={20} color={tint} />
              <ThemedText type="defaultSemiBold">{t('settingsLanguage')}</ThemedText>
            </View>
            {renderSelectTrigger(language === 'fr' ? 'FR' : 'EN', () => setLanguageMenuOpen((prev) => !prev))}
            {languageMenuOpen ? (
              <View style={[styles.dropdownCard, { backgroundColor: card, borderColor: border }]}>
                {renderChip('FR', language === 'fr', () => {
                  setLanguage('fr');
                  setLanguageMenuOpen(false);
                })}
                {renderChip('EN', language === 'en', () => {
                  setLanguage('en');
                  setLanguageMenuOpen(false);
                })}
              </View>
            ) : null}
          </View>

          <View style={[styles.settingItem, { borderColor: border }]}>
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons name="theme-light-dark" size={20} color={tint} />
              <ThemedText type="defaultSemiBold">{t('settingsTheme')}</ThemedText>
            </View>
            {renderSelectTrigger(
              themeOptions.find((option) => option.id === themePreference)?.label ?? t('settingsThemeSystem'),
              () => setThemeMenuOpen((prev) => !prev)
            )}
            {themeMenuOpen ? (
              <View style={[styles.dropdownCard, { backgroundColor: card, borderColor: border }]}>
                {themeOptions.map((option) =>
                  renderChip(option.label, themePreference === option.id, () => {
                    setThemePreference(option.id);
                    setThemeMenuOpen(false);
                  })
                )}
              </View>
            ) : null}
            <ThemedText style={{ color: mutedText }}>{t('settingsThemeSystemHint')}</ThemedText>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <ThemedText type="defaultSemiBold">{t('settingsSecurity')}</ThemedText>

          <View style={[styles.settingItem, { borderColor: border }]}>
            <View style={styles.switchRow}>
              <View style={styles.switchContent}>
                <View style={[styles.switchIcon, { backgroundColor: background, borderColor: border }]}>
                  <MaterialCommunityIcons name="bell-ring-outline" size={18} color={tint} />
                </View>
                <View style={styles.switchText}>
                  <ThemedText type="defaultSemiBold">{t('settingsNotifications')}</ThemedText>
                  <ThemedText style={{ color: mutedText }}>{t('notificationsSubtitle')}</ThemedText>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                thumbColor={notificationsEnabled ? tint : '#FFFFFF'}
                trackColor={{ true: tint, false: border }}
              />
            </View>
          </View>

          <View style={[styles.settingItem, { borderColor: border }]}>
            <View style={styles.switchRow}>
              <View style={styles.switchContent}>
                <View style={[styles.switchIcon, { backgroundColor: background, borderColor: border }]}>
                  <MaterialCommunityIcons name="shield-key-outline" size={18} color={tint} />
                </View>
                <View style={styles.switchText}>
                  <ThemedText type="defaultSemiBold">{t('settingsTwoFactor')}</ThemedText>
                  <ThemedText style={{ color: mutedText }}>{t('settingsTwoFactorDetail')}</ThemedText>
                </View>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                thumbColor={twoFactorEnabled ? tint : '#FFFFFF'}
                trackColor={{ true: tint, false: border }}
              />
            </View>
          </View>

          <View style={[styles.settingItem, { borderColor: border }]}>
            <View style={styles.switchRow}>
              <View style={styles.switchContent}>
                <View style={[styles.switchIcon, { backgroundColor: background, borderColor: border }]}>
                  <MaterialCommunityIcons name="lock-open-variant-outline" size={18} color={tint} />
                </View>
                <View style={styles.switchText}>
                  <ThemedText type="defaultSemiBold">{t('settingsAppUnlock')}</ThemedText>
                  <ThemedText style={{ color: mutedText }}>{t('settingsAppUnlockDetail')}</ThemedText>
                </View>
              </View>
              <Switch
                value={appUnlockEnabled}
                onValueChange={setAppUnlockEnabled}
                thumbColor={appUnlockEnabled ? tint : '#FFFFFF'}
                trackColor={{ true: tint, false: border }}
              />
            </View>
          </View>

          {isBiometricSupported ? (
            <View style={[styles.settingItem, { borderColor: border }]}>
              <View style={styles.switchRow}>
                <View style={styles.switchContent}>
                  <View style={[styles.switchIcon, { backgroundColor: background, borderColor: border }]}>
                    <MaterialCommunityIcons name="fingerprint" size={18} color={tint} />
                  </View>
                  <View style={styles.switchText}>
                    <ThemedText type="defaultSemiBold">{t('settingsLoginBiometric')}</ThemedText>
                    <ThemedText style={{ color: mutedText }}>
                      {t('settingsLoginBiometricDetail', { method: biometricMethod })}
                    </ThemedText>
                  </View>
                </View>
                <Switch
                  value={loginBiometricEnabled}
                  onValueChange={setLoginBiometricEnabled}
                  thumbColor={loginBiometricEnabled ? tint : '#FFFFFF'}
                  trackColor={{ true: tint, false: border }}
                />
              </View>
            </View>
          ) : null}
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <ThemedText type="defaultSemiBold">{t('settingsSessions')}</ThemedText>
          {renderRow({
            title: t('settingsSessions'),
            subtitle: t('settingsSessionsSubtitle'),
            icon: 'devices',
            onPress: () => router.push('/sessions'),
          })}
          {renderRow({
            title: t('settingsLoginHistory'),
            subtitle: t('settingsLoginHistorySubtitle'),
            icon: 'shield-check-outline',
            onPress: () => router.push('/login-history'),
          })}
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <ThemedText type="defaultSemiBold">{t('settingsAbout')}</ThemedText>
          {renderRow({
            title: t('settingsAppRating'),
            subtitle: t('rateLabel'),
            icon: 'star-outline',
            onPress: () => {},
          })}
          {renderRow({
            title: t('settingsShareApp'),
            subtitle: t('shareLabel'),
            icon: 'share-variant-outline',
            onPress: () => {},
          })}
          <View style={[styles.row, { borderColor: border }]}>
            <View style={styles.rowContent}>
              <View style={[styles.rowIcon, { backgroundColor: background, borderColor: border }]}>
                <MaterialCommunityIcons name="information-outline" size={18} color={tint} />
              </View>
              <View style={styles.rowText}>
                <ThemedText type="defaultSemiBold">{t('settingsVersion')}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{versionLabel}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => toggleLogoutConfirm()}
          style={[styles.logoutButton, { borderColor: danger }]}>
          <MaterialCommunityIcons name="logout" size={18} color={danger} />
          <ThemedText style={{ color: danger }}>{t('settingsLogout')}</ThemedText>
        </Pressable>
        {logoutConfirmOpen ? (
          <View style={[styles.logoutConfirmCard, { borderColor: border, backgroundColor: card }]}>
            <ThemedText type="defaultSemiBold">{t('settingsLogoutConfirm')}</ThemedText>
            <View style={styles.logoutActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  toggleLogoutConfirm(false);
                  signOut();
                }}
                style={({ pressed }) => [
                  styles.logoutChoice,
                  { backgroundColor: danger, opacity: pressed ? 0.8 : 1 },
                ]}>
                <ThemedText style={styles.logoutChoiceText}>{t('settingsLogoutConfirmYes')}</ThemedText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => toggleLogoutConfirm(false)}
                style={({ pressed }) => [
                  styles.logoutChoice,
                  { backgroundColor: success, opacity: pressed ? 0.8 : 1 },
                ]}>
                <ThemedText style={styles.logoutChoiceText}>{t('settingsLogoutConfirmNo')}</ThemedText>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    paddingTop: 56,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  settingItem: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectTrigger: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    gap: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  switchContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchText: {
    flex: 1,
    gap: 4,
  },
  row: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  logoutButton: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logoutConfirmCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  logoutActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  logoutChoice: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutChoiceText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
