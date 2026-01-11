import { Alert, Modal, Platform, Pressable, ScrollView, Share, StyleSheet, Switch, View } from 'react-native';
import { useMemo, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';

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
    themePreference,
    setThemePreference,
    language,
    setLanguage,
    signOut,
  } = useAppStore((state) => ({
    notificationsEnabled: state.notificationsEnabled,
    setNotificationsEnabled: state.setNotificationsEnabled,
    twoFactorEnabled: state.twoFactorEnabled,
    setTwoFactorEnabled: state.setTwoFactorEnabled,
    appUnlockEnabled: state.appUnlockEnabled,
    setAppUnlockEnabled: state.setAppUnlockEnabled,
    loginBiometricEnabled: state.loginBiometricEnabled,
    setLoginBiometricEnabled: state.setLoginBiometricEnabled,
    themePreference: state.themePreference,
    setThemePreference: state.setThemePreference,
    language: state.language,
    setLanguage: state.setLanguage,
    signOut: state.signOut,
  }));

  const [activeSheet, setActiveSheet] = useState<null | 'language' | 'theme'>(null);

  const biometricLabel = Platform.select({
    ios: 'Face ID',
    android: 'empreinte digitale',
    default: null,
  });
  const biometricIcon = Platform.OS === 'ios' ? 'face-recognition' : 'fingerprint';
  const appVersion = useMemo(() => {
    if (typeof Constants.expoConfig?.version === 'string') {
      return Constants.expoConfig.version;
    }
    if (typeof Constants.nativeAppVersion === 'string') {
      return Constants.nativeAppVersion;
    }
    if (typeof Constants.expoConfig?.runtimeVersion === 'string') {
      return Constants.expoConfig.runtimeVersion;
    }
    return '1.0.0';
  }, []);

  const languageOptions = useMemo(
    () => [
      { id: 'fr' as const, label: 'Français' },
      { id: 'en' as const, label: 'English' },
    ],
    []
  );

  const themeOptions = useMemo(
    () => [
      { id: 'system' as const, label: 'Auto (système)' },
      { id: 'light' as const, label: 'Clair' },
      { id: 'dark' as const, label: 'Sombre' },
      { id: 'nocturne' as const, label: 'Nocturne (par défaut)' },
    ],
    []
  );

  const languageLabel = useMemo(
    () => languageOptions.find((option) => option.id === language)?.label ?? 'Français',
    [language, languageOptions]
  );

  const themeLabel = useMemo(
    () => themeOptions.find((option) => option.id === themePreference)?.label ?? 'Nocturne (par défaut)',
    [themeOptions, themePreference]
  );

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Découvre MY TICKET et profite des meilleurs pronos sportifs.',
      });
    } catch {
      Alert.alert('Partage indisponible', "Le partage n'a pas pu être lancé pour le moment.");
    }
  };

  const handleRateApp = async () => {
    const url = 'https://myticket.app/avis';
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert('Lien indisponible', "Impossible d'ouvrir la page d'évaluation.");
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert('Lien indisponible', "Impossible d'ouvrir la page d'évaluation.");
    }
  };

  const handleSignOut = () => {
    Alert.alert('Se déconnecter', 'Souhaites-tu vraiment te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  const biometricSecurityRows: RowItem[] = biometricLabel
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
    : [];

  const biometricLoginRows: RowItem[] = biometricLabel
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
    : [];

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
          label: 'Langue de l’application',
          value: languageLabel,
          icon: 'translate',
          type: 'link',
          onPress: () => setActiveSheet('language'),
        },
        {
          id: 'theme',
          label: 'Thème',
          value: themeLabel,
          icon: 'weather-night',
          type: 'link',
          onPress: () => setActiveSheet('theme'),
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
        ...biometricSecurityRows,
      ],
    },
    {
      id: 'login',
      title: 'Connexion',
      data: biometricLoginRows,
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
          onPress: () => router.push('/login-history'),
        },
      ],
    },
    {
      id: 'about',
      title: 'À propos',
      data: [
        {
          id: 'rate',
          label: 'Évaluer l’application',
          value: 'Donne ton avis sur MY TICKET',
          icon: 'star-outline',
          type: 'link',
          onPress: handleRateApp,
        },
        {
          id: 'share',
          label: 'Partager l’application',
          value: 'Invite un ami à rejoindre',
          icon: 'share-variant-outline',
          type: 'link',
          onPress: handleShareApp,
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

  const currentOptions = activeSheet === 'language' ? languageOptions : themeOptions;
  const activeValue = activeSheet === 'language' ? language : themePreference;
  const activeTitle = activeSheet === 'language' ? 'Choisir la langue' : 'Choisir le thème';

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title="Paramètres" subtitle="Personnalise ton expérience MY TICKET." />
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
                    <RowWrapper
                      key={row.id}
                      {...(row.type === 'link'
                        ? { onPress: row.onPress, accessibilityRole: 'button' as const }
                        : {})}
                      style={[styles.rowButton, { borderColor: border }]}>
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
        <Pressable accessibilityRole="button" onPress={handleSignOut} style={[styles.logoutButton, { borderColor: danger }]}>
          <MaterialCommunityIcons name="logout" size={18} color={danger} />
          <ThemedText style={[styles.logoutText, { color: danger }]}>Se déconnecter</ThemedText>
        </Pressable>
      </ScrollView>
      <Modal visible={activeSheet !== null} transparent animationType="fade" onRequestClose={() => setActiveSheet(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setActiveSheet(null)}>
          <Pressable
            style={[styles.modalCard, { backgroundColor: card, borderColor: border }]}
            onPress={() => undefined}>
            <ThemedText type="defaultSemiBold">{activeTitle}</ThemedText>
            <View style={styles.modalOptions}>
              {currentOptions.map((option) => {
                const selected = option.id === activeValue;
                return (
                  <Pressable
                    key={option.id}
                    style={[styles.optionRow, { borderColor: border }]}
                    onPress={() => {
                      if (activeSheet === 'language') {
                        setLanguage(option.id as 'fr' | 'en');
                      } else {
                        setThemePreference(option.id as 'system' | 'light' | 'dark' | 'nocturne');
                      }
                      setActiveSheet(null);
                    }}>
                    <ThemedText>{option.label}</ThemedText>
                    {selected ? <MaterialCommunityIcons name="check" size={18} color={tint} /> : null}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  modalOptions: {
    gap: 12,
  },
  optionRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
