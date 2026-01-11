import { Pressable, StyleSheet, Switch, View, Platform, ScrollView, Modal, Share, Linking } from 'react-native';
import { useMemo, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { shallow } from 'zustand/shallow';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppStore } from '@/store/useAppStore';

type RowItem = {
  id: string;
  label: string;
  value?: string;
  icon: string;
  type: 'link' | 'toggle' | 'info';
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
};

type Section = {
  id: string;
  title: string;
  data: RowItem[];
};

export default function SettingsScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const danger = useThemeColor({}, 'danger');
  const backgroundSecondary = useThemeColor({}, 'backgroundSecondary');

  const {
    notificationsEnabled,
    setNotificationsEnabled,
    twoFactorEnabled,
    setTwoFactorEnabled,
    appUnlockEnabled,
    setAppUnlockEnabled,
    loginBiometricEnabled,
    setLoginBiometricEnabled,
    language,
    setLanguage,
    themePreference,
    setThemePreference,
    signOut,
  } = useAppStore(
    (state) => ({
      notificationsEnabled: state.notificationsEnabled,
      setNotificationsEnabled: state.setNotificationsEnabled,
      twoFactorEnabled: state.twoFactorEnabled,
      setTwoFactorEnabled: state.setTwoFactorEnabled,
      appUnlockEnabled: state.appUnlockEnabled,
      setAppUnlockEnabled: state.setAppUnlockEnabled,
      loginBiometricEnabled: state.loginBiometricEnabled,
      setLoginBiometricEnabled: state.setLoginBiometricEnabled,
      language: state.language,
      setLanguage: state.setLanguage,
      themePreference: state.themePreference,
      setThemePreference: state.setThemePreference,
      signOut: state.signOut,
    }),
    shallow
  );
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const biometricLabel = Platform.select({
    ios: 'Face ID',
    android: 'empreinte digitale',
    default: null,
  });
  const biometricIcon = Platform.OS === 'ios' ? 'face-recognition' : 'fingerprint';
  const appVersion =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? Constants.expoConfig?.runtimeVersion ?? '1.0.0';

  const languageLabel = useMemo(() => {
    return language === 'en' ? 'English' : 'Français';
  }, [language]);

  const themeLabel = useMemo(() => {
    switch (themePreference) {
      case 'light':
        return 'Clair';
      case 'dark':
        return 'Sombre';
      case 'system':
        return 'Auto (système)';
      case 'nocturne':
      default:
        return 'Nocturne (par défaut)';
    }
  }, [themePreference]);

  const handleShare = async () => {
    await Share.share({
      message: 'Découvre MY TICKET : pronostics premium, suivi de tickets et alertes live !',
    });
  };

  const handleRate = () => {
    const url = Platform.select({
      ios: 'itms-apps://itunes.apple.com/app/id0000000000',
      android: 'market://details?id=com.myticket.app',
      default: 'https://myticket.app',
    });
    if (url) {
      void Linking.openURL(url);
    }
  };

  const handleLogout = () => {
    signOut();
    router.replace('/onboarding');
  };

  const sections: Section[] = [
    {
      id: 'general',
      title: 'Général',
      data: [
        {
          id: 'lang',
          label: 'Langue de l’app',
          value: languageLabel,
          icon: 'translate',
          type: 'link',
          onPress: () => setLanguageModalVisible(true),
        },
        {
          id: 'theme',
          label: 'Thème',
          value: themeLabel,
          icon: 'weather-night',
          type: 'link',
          onPress: () => setThemeModalVisible(true),
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      data: [
        {
          id: 'push',
          label: 'Activer les notifications',
          value: 'Alertes, résultats et promos',
          icon: 'bell-ring-outline',
          type: 'toggle',
          toggleValue: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
      ],
    },
    {
      id: 'security',
      title: 'Sécurité',
      data: [
        {
          id: '2fa',
          label: 'Authentification 2FA',
          value: 'Double validation des connexions',
          icon: 'shield-check-outline',
          type: 'toggle',
          toggleValue: twoFactorEnabled,
          onToggle: setTwoFactorEnabled,
        },
        ...(biometricLabel
          ? [
              {
                id: 'unlock',
                label: `Déverrouiller avec ${biometricLabel}`,
                value: 'Sinon via le mot de passe',
                icon: biometricIcon,
                type: 'toggle',
                toggleValue: appUnlockEnabled,
                onToggle: setAppUnlockEnabled,
              },
            ]
          : []),
      ],
    },
    {
      id: 'login',
      title: 'Connexion',
      data: biometricLabel
        ? [
            {
              id: 'biometric-login',
              label: `Connexion avec ${biometricLabel}`,
              value: 'Option rapide sur l’écran de connexion',
              icon: biometricIcon,
              type: 'toggle',
              toggleValue: loginBiometricEnabled,
              onToggle: setLoginBiometricEnabled,
            },
          ]
        : [],
    },
    {
      id: 'sessions',
      title: 'Sessions',
      data: [
        {
          id: 'active-sessions',
          label: 'Sessions actives',
          value: 'Appareils connectés',
          icon: 'devices',
          type: 'link',
          onPress: () => router.push('/sessions'),
        },
        {
          id: 'history',
          label: 'Historique des connexions',
          value: 'Dernières activités',
          icon: 'history',
          type: 'link',
          onPress: () => router.push('/history'),
        },
      ],
    },
    {
      id: 'about',
      title: 'À propos',
      data: [
        {
          id: 'rate',
          label: 'Évaluer l’app',
          value: 'Donne ton avis sur MY TICKET',
          icon: 'star-outline',
          type: 'link',
          onPress: handleRate,
        },
        {
          id: 'share',
          label: 'Partager l’application',
          value: 'Invite un ami à rejoindre',
          icon: 'share-variant-outline',
          type: 'link',
          onPress: handleShare,
        },
        {
          id: 'version',
          label: 'Version',
          value: appVersion,
          icon: 'information-outline',
          type: 'info',
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title="Réglages" subtitle="Personnalise ton expérience MY TICKET." />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {sections
          .filter((section) => section.data.length > 0)
          .map((section) => (
            <View key={section.id} style={styles.section}>
              <ThemedText style={{ color: mutedText }}>{section.title.toUpperCase()}</ThemedText>
              <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
                {section.data.map((row) => {
                  if (row.type === 'link') {
                    return (
                      <Pressable
                        key={row.id}
                        style={[styles.rowButton, { borderColor: border }]}
                        onPress={row.onPress}>
                        <View style={styles.rowContent}>
                          <View style={[styles.iconWrap, { backgroundColor: backgroundSecondary }]}>
                            <MaterialCommunityIcons name={row.icon as any} size={18} color={tint} />
                          </View>
                          <View style={styles.rowText}>
                            <ThemedText>{row.label}</ThemedText>
                            {row.value ? <ThemedText style={{ color: mutedText }}>{row.value}</ThemedText> : null}
                          </View>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
                      </Pressable>
                    );
                  }

                  return (
                    <View key={row.id} style={[styles.rowButton, { borderColor: border }]}>
                      <View style={styles.rowContent}>
                        <View style={[styles.iconWrap, { backgroundColor: backgroundSecondary }]}>
                          <MaterialCommunityIcons name={row.icon as any} size={18} color={tint} />
                        </View>
                        <View style={styles.rowText}>
                          <ThemedText>{row.label}</ThemedText>
                          {row.value ? <ThemedText style={{ color: mutedText }}>{row.value}</ThemedText> : null}
                        </View>
                      </View>
                      {row.type === 'toggle' ? (
                        <Switch
                          value={row.toggleValue}
                          onValueChange={row.onToggle}
                          trackColor={{ false: border, true: tint }}
                          thumbColor={row.toggleValue ? '#FFFFFF' : '#F2F2F2'}
                        />
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        <Pressable style={[styles.logoutButton, { borderColor: danger }]} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={18} color={danger} />
          <ThemedText style={[styles.logoutText, { color: danger }]}>Se déconnecter</ThemedText>
        </Pressable>
      </ScrollView>
      <Modal transparent visible={languageModalVisible} animationType="fade" onRequestClose={() => setLanguageModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setLanguageModalVisible(false)}>
          <View style={[styles.modalCard, { backgroundColor: card, borderColor: border }]}>
            <ThemedText type="defaultSemiBold">Choisir la langue</ThemedText>
            <Pressable
              style={[styles.optionRow, language === 'fr' && styles.optionRowActive]}
              onPress={() => {
                setLanguage('fr');
                setLanguageModalVisible(false);
              }}>
              <ThemedText>Français</ThemedText>
              {language === 'fr' ? <MaterialCommunityIcons name="check" size={18} color={tint} /> : null}
            </Pressable>
            <Pressable
              style={[styles.optionRow, language === 'en' && styles.optionRowActive]}
              onPress={() => {
                setLanguage('en');
                setLanguageModalVisible(false);
              }}>
              <ThemedText>English</ThemedText>
              {language === 'en' ? <MaterialCommunityIcons name="check" size={18} color={tint} /> : null}
            </Pressable>
          </View>
        </Pressable>
      </Modal>
      <Modal transparent visible={themeModalVisible} animationType="fade" onRequestClose={() => setThemeModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setThemeModalVisible(false)}>
          <View style={[styles.modalCard, { backgroundColor: card, borderColor: border }]}>
            <ThemedText type="defaultSemiBold">Choisir le thème</ThemedText>
            {[
              { id: 'nocturne', label: 'Nocturne (par défaut)' },
              { id: 'light', label: 'Clair' },
              { id: 'dark', label: 'Sombre' },
              { id: 'system', label: 'Auto (système)' },
            ].map((option) => (
              <Pressable
                key={option.id}
                style={[styles.optionRow, themePreference === option.id && styles.optionRowActive]}
                onPress={() => {
                  setThemePreference(option.id as 'system' | 'light' | 'dark' | 'nocturne');
                  setThemeModalVisible(false);
                }}>
                <ThemedText>{option.label}</ThemedText>
                {themePreference === option.id ? (
                  <MaterialCommunityIcons name="check" size={18} color={tint} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
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
  scrollContent: {
    paddingBottom: 24,
    gap: 18,
  },
  section: {
    gap: 10,
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
    flex: 1,
  },
  rowText: {
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  optionRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionRowActive: {
    backgroundColor: 'rgba(63, 160, 255, 0.12)',
  },
});
