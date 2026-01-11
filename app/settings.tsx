import { Pressable, StyleSheet, Switch, View, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Constants from 'expo-constants';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

type RowItem = {
  id: string;
  label: string;
  value?: string;
  icon: string;
  type: 'link' | 'toggle' | 'info';
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
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

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [appUnlockEnabled, setAppUnlockEnabled] = useState(true);
  const [loginBiometricEnabled, setLoginBiometricEnabled] = useState(false);

  const biometricLabel = Platform.select({
    ios: 'Face ID',
    android: 'empreinte digitale',
    default: null,
  });
  const biometricIcon = Platform.OS === 'ios' ? 'face-recognition' : 'fingerprint';
  const appVersion =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? Constants.expoConfig?.runtimeVersion ?? '1.0.0';

  const sections: Section[] = [
    {
      id: 'general',
      title: 'Général',
      data: [
        {
          id: 'lang',
          label: 'Langue de l’app',
          value: 'Français / English',
          icon: 'translate',
          type: 'link',
        },
        {
          id: 'theme',
          label: 'Thème',
          value: 'Nocturne (par défaut)',
          icon: 'weather-night',
          type: 'link',
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
        },
        {
          id: 'history',
          label: 'Historique des connexions',
          value: 'Dernières activités',
          icon: 'history',
          type: 'link',
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
        },
        {
          id: 'share',
          label: 'Partager l’application',
          value: 'Invite un ami à rejoindre',
          icon: 'share-variant-outline',
          type: 'link',
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
                  const RowWrapper = row.type === 'link' ? Pressable : View;
                  return (
                    <RowWrapper key={row.id} style={[styles.rowButton, { borderColor: border }]}>
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
                      ) : row.type === 'link' ? (
                        <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
                      ) : null}
                    </RowWrapper>
                  );
                })}
              </View>
            </View>
          ))}
        <Pressable style={[styles.logoutButton, { borderColor: danger }]}>
          <MaterialCommunityIcons name="logout" size={18} color={danger} />
          <ThemedText style={[styles.logoutText, { color: danger }]}>Se déconnecter</ThemedText>
        </Pressable>
      </ScrollView>
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
});
