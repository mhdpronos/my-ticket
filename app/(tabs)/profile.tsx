// Le code de la page profil avec authentification locale.
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { UserProfile } from '@/types';

export default function ProfileScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const success = useThemeColor({}, 'success');
  const { t } = useTranslation();

  const userAccess = useAppStore((state) => state.userAccess);
  const userProfile = useAppStore((state) => state.userProfile);
  const setUserAccess = useAppStore((state) => state.setUserAccess);
  const updateUserProfile = useAppStore((state) => state.updateUserProfile);
  const signOut = useAppStore((state) => state.signOut);

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState(userProfile.email);
  const [passwordInput, setPasswordInput] = useState('');

  useScrollToTop(scrollRef);

  const handleProfileChange =
    (field: keyof UserProfile) =>
    (value: string) => {
      if (userProfile[field] !== value) {
        updateUserProfile({ [field]: value });
      }
    };

  const handleAuth = () => {
    if (userProfile.email !== emailInput) {
      updateUserProfile({ email: emailInput });
    }
    setUserAccess({ status: 'FREE', isGuest: false });
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.container, { backgroundColor: background }]}
      contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={[styles.titleBar, { backgroundColor: tint }]}>
          <ThemedText type="title" style={styles.titleText}>
            {t('profileTitle')}
          </ThemedText>
        </View>
        <ThemedText style={[styles.subtitleText, { color: mutedText }]}>
          {userAccess.isGuest ? t('profileGuest') : t('profileConnected')} • {userAccess.status}
        </ThemedText>
        <View style={[styles.avatar, { borderColor: border }]}> 
          <MaterialCommunityIcons name="account-outline" size={30} color={mutedText} />
        </View>
        {!userAccess.isGuest && (
          <Pressable
            accessibilityRole="button"
            onPress={signOut}
            style={[styles.signOut, { borderColor: border }]}> 
            <MaterialCommunityIcons name="logout" size={16} color={mutedText} />
            <ThemedText style={{ color: mutedText }}>{t('profileSignOut')}</ThemedText>
          </Pressable>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}> 
        <View style={styles.authTabs}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setAuthMode('login')}
            style={[styles.authTab, { backgroundColor: authMode === 'login' ? tint : background }]}> 
            <ThemedText style={{ color: authMode === 'login' ? '#FFFFFF' : mutedText }}>{t('authLogin')}</ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setAuthMode('signup')}
            style={[styles.authTab, { backgroundColor: authMode === 'signup' ? tint : background }]}> 
            <ThemedText style={{ color: authMode === 'signup' ? '#FFFFFF' : mutedText }}>{t('authSignup')}</ThemedText>
          </Pressable>
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText type="defaultSemiBold">{t('authEmail')}</ThemedText>
          <TextInput
            value={emailInput}
            onChangeText={setEmailInput}
            placeholder={t('authEmailPlaceholder')}
            placeholderTextColor={mutedText}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, { borderColor: border, color: mutedText }]}
          />
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText type="defaultSemiBold">{t('authPassword')}</ThemedText>
          <TextInput
            value={passwordInput}
            onChangeText={setPasswordInput}
            placeholder={t('authPasswordPlaceholder')}
            placeholderTextColor={mutedText}
            secureTextEntry
            style={[styles.input, { borderColor: border, color: mutedText }]}
          />
        </View>

        {authMode === 'signup' && (
          <View style={styles.fieldGroup}>
            <ThemedText type="defaultSemiBold">{t('authFullName')}</ThemedText>
            <TextInput
              value={userProfile.fullName}
              onChangeText={handleProfileChange('fullName')}
              placeholder={t('authFullNamePlaceholder')}
              placeholderTextColor={mutedText}
              style={[styles.input, { borderColor: border, color: mutedText }]}
            />
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={handleAuth}
          style={[styles.primaryButton, { backgroundColor: tint }]}> 
          <ThemedText style={styles.primaryButtonText}>
            {authMode === 'login' ? t('authLoginButton') : t('authSignupButton')}
          </ThemedText>
        </Pressable>

        {!userAccess.isGuest && (
          <ThemedText style={{ color: success }}>{t('authSuccess')}</ThemedText>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}> 
        <ThemedText type="defaultSemiBold">{t('profileInfoTitle')}</ThemedText>
        <View style={styles.fieldGroup}>
          <ThemedText>{t('profileCity')}</ThemedText>
          <TextInput
            value={userProfile.city}
            onChangeText={handleProfileChange('city')}
            placeholder={t('profileCityPlaceholder')}
            placeholderTextColor={mutedText}
            style={[styles.input, { borderColor: border, color: mutedText }]}
          />
        </View>
        <View style={styles.fieldGroup}>
          <ThemedText>{t('profilePhone')}</ThemedText>
          <TextInput
            value={userProfile.phone}
            onChangeText={handleProfileChange('phone')}
            placeholder={t('profilePhonePlaceholder')}
            placeholderTextColor={mutedText}
            keyboardType="phone-pad"
            style={[styles.input, { borderColor: border, color: mutedText }]}
          />
        </View>
        <View style={styles.fieldGroup}>
          <ThemedText>{t('profileFavoriteTeam')}</ThemedText>
          <TextInput
            value={userProfile.favoriteTeam}
            onChangeText={handleProfileChange('favoriteTeam')}
            placeholder={t('profileFavoriteTeamPlaceholder')}
            placeholderTextColor={mutedText}
            style={[styles.input, { borderColor: border, color: mutedText }]}
          />
        </View>
        <View style={styles.fieldGroup}>
          <ThemedText>{t('profileBirthDate')}</ThemedText>
          <TextInput
            value={userProfile.birthDate}
            onChangeText={handleProfileChange('birthDate')}
            placeholder={t('profileBirthDatePlaceholder')}
            placeholderTextColor={mutedText}
            style={[styles.input, { borderColor: border, color: mutedText }]}
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}> 
        <ThemedText type="defaultSemiBold">{t('subscriptionCardTitle')}</ThemedText>
        <ThemedText style={{ color: mutedText }}>
          {userAccess.status === 'PREMIUM' ? t('subscriptionCardSubtitlePremium') : t('subscriptionCardSubtitleFree')}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/subscription')}
          style={[styles.primaryButton, { backgroundColor: tint }]}> 
          <ThemedText style={styles.primaryButtonText}>{t('buttonSeeOffers')}</ThemedText>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}> 
        <ThemedText type="defaultSemiBold">{t('shortcutsTitle')}</ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/settings')}
          style={[styles.actionRow, { borderColor: border }]}> 
          <View style={styles.actionRowContent}>
            <MaterialCommunityIcons name="cog-outline" size={18} color={tint} />
            <ThemedText>{t('buttonSettings')}</ThemedText>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/support')}
          style={[styles.actionRow, { borderColor: border }]}> 
          <View style={styles.actionRowContent}>
            <MaterialCommunityIcons name="help-circle-outline" size={18} color={tint} />
            <ThemedText>{t('buttonSupport')}</ThemedText>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/legal')}
          style={[styles.actionRow, { borderColor: border }]}> 
          <View style={styles.actionRowContent}>
            <MaterialCommunityIcons name="file-document-outline" size={18} color={tint} />
            <ThemedText>{t('legalTitle')}</ThemedText>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 40,
  },
  header: {
    gap: 12,
    alignItems: 'center',
  },
  titleBar: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  titleText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitleText: {
    textAlign: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  authTabs: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    gap: 6,
  },
  authTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryButton: {
    marginTop: 4,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
