// Le code de la page profil avec authentification locale.
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { UserProfile } from '@/types';

type AuthMode = 'login' | 'signup';
type LoginMethod = 'email' | 'phone';
type EditableField = keyof UserProfile;

type CountryOption = {
  code: string;
  name: string;
  dialCode: string;
  cities: string[];
};

const countries: CountryOption[] = [
  {
    code: 'FR',
    name: 'France',
    dialCode: '+33',
    cities: ['Paris', 'Lyon', 'Marseille', 'Lille'],
  },
  {
    code: 'CI',
    name: 'Côte d’Ivoire',
    dialCode: '+225',
    cities: ['Abidjan', 'Bouaké', 'Yamoussoukro'],
  },
  {
    code: 'SN',
    name: 'Sénégal',
    dialCode: '+221',
    cities: ['Dakar', 'Thiès', 'Saint-Louis'],
  },
];

const defaultCountry = countries[0];

const createUserId = () => `MT-${Math.floor(100000 + Math.random() * 900000)}`;

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

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [emailInput, setEmailInput] = useState(userProfile.email);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginCountry, setLoginCountry] = useState<CountryOption>(defaultCountry);
  const [loginPhone, setLoginPhone] = useState('');

  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCountry, setSignupCountry] = useState<CountryOption>(defaultCountry);
  const [signupCity, setSignupCity] = useState(defaultCountry.cities[0]);

  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [passwordDelivery, setPasswordDelivery] = useState<LoginMethod>('email');

  const profileCountry = useMemo(() => {
    return countries.find((country) => country.name === userProfile.country) ?? defaultCountry;
  }, [userProfile.country]);

  useScrollToTop(scrollRef);

  const handleLogin = () => {
    if (!userProfile.userId) {
      updateUserProfile({ userId: createUserId() });
    }
    if (loginMethod === 'email') {
      if (userProfile.email !== emailInput) {
        updateUserProfile({ email: emailInput });
      }
    } else {
      const fullPhone = `${loginCountry.dialCode} ${loginPhone}`.trim();
      if (userProfile.phone !== fullPhone) {
        updateUserProfile({ phone: fullPhone });
      }
    }
    setUserAccess({ status: 'FREE', isGuest: false });
  };

  const handleSignup = () => {
    const fullPhone = `${signupCountry.dialCode} ${signupPhone}`.trim();
    updateUserProfile({
      userId: userProfile.userId || createUserId(),
      firstName: signupFirstName,
      lastName: signupLastName,
      email: signupEmail,
      phone: fullPhone,
      password: signupPassword,
      country: signupCountry.name,
      city: signupCity,
    });
    setUserAccess({ status: 'FREE', isGuest: false });
  };

  const startEditing = (field: EditableField) => {
    setEditingField(field);
    setDraftValue(userProfile[field] ?? '');
    if (field === 'password') {
      setPasswordDelivery('email');
    }
  };

  const handleSaveEdit = () => {
    if (!editingField) {
      return;
    }

    if (editingField === 'country') {
      const nextCountry = countries.find((country) => country.name === draftValue) ?? defaultCountry;
      const nextCity = nextCountry.cities.includes(userProfile.city) ? userProfile.city : nextCountry.cities[0];
      updateUserProfile({ country: nextCountry.name, city: nextCity });
    } else {
      updateUserProfile({ [editingField]: draftValue });
    }
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setDraftValue('');
  };

  const renderSelectionChip = (label: string, selected: boolean, onPress: () => void) => (
    <Pressable
      key={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectionChip,
        {
          borderColor: border,
          backgroundColor: selected ? tint : 'transparent',
          opacity: pressed ? 0.86 : 1,
        },
      ]}>
      <ThemedText style={{ color: selected ? '#FFFFFF' : mutedText }}>{label}</ThemedText>
    </Pressable>
  );

  const renderEditableRow = (label: string, value: string, field: EditableField, masked?: boolean) => (
    <View style={styles.infoRow}>
      <View style={styles.infoRowHeader}>
        <ThemedText type="defaultSemiBold">{label}</ThemedText>
        <Pressable accessibilityRole="button" onPress={() => startEditing(field)} style={styles.editButton}>
          <MaterialCommunityIcons name="pencil-outline" size={16} color={tint} />
        </Pressable>
      </View>
      <ThemedText style={{ color: mutedText }}>
        {masked ? '••••••••' : value || t('profileEmptyValue')}
      </ThemedText>
      {editingField === field && field !== 'password' && field !== 'country' && field !== 'city' && (
        <View style={styles.editPanel}>
          <TextInput
            value={draftValue}
            onChangeText={setDraftValue}
            placeholder={t('profileEditPlaceholder')}
            placeholderTextColor={mutedText}
            style={[styles.inputStandalone, { borderColor: border, color: mutedText }]}
          />
          <View style={styles.editActions}>
            <Pressable
              accessibilityRole="button"
              onPress={handleCancelEdit}
              style={[styles.secondaryButton, { borderColor: border }]}> 
              <ThemedText style={{ color: mutedText }}>{t('buttonCancel')}</ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleSaveEdit}
              style={[styles.primaryButtonSmall, { backgroundColor: tint }]}> 
              <ThemedText style={styles.primaryButtonText}>{t('buttonSave')}</ThemedText>
            </Pressable>
          </View>
        </View>
      )}

      {editingField === field && field === 'country' && (
        <View style={styles.editPanel}>
          <View style={styles.selectionGrid}>
            {countries.map((country) =>
              renderSelectionChip(
                `${country.name} (${country.dialCode})`,
                draftValue === country.name || (!draftValue && country.name === userProfile.country),
                () => setDraftValue(country.name),
              ),
            )}
          </View>
          <View style={styles.editActions}>
            <Pressable
              accessibilityRole="button"
              onPress={handleCancelEdit}
              style={[styles.secondaryButton, { borderColor: border }]}> 
              <ThemedText style={{ color: mutedText }}>{t('buttonCancel')}</ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleSaveEdit}
              style={[styles.primaryButtonSmall, { backgroundColor: tint }]}> 
              <ThemedText style={styles.primaryButtonText}>{t('buttonSave')}</ThemedText>
            </Pressable>
          </View>
        </View>
      )}

      {editingField === field && field === 'city' && (
        <View style={styles.editPanel}>
          <View style={styles.selectionGrid}>
            {profileCountry.cities.map((city) =>
              renderSelectionChip(city, draftValue === city || (!draftValue && city === userProfile.city), () =>
                setDraftValue(city),
              ),
            )}
          </View>
          <View style={styles.editActions}>
            <Pressable
              accessibilityRole="button"
              onPress={handleCancelEdit}
              style={[styles.secondaryButton, { borderColor: border }]}> 
              <ThemedText style={{ color: mutedText }}>{t('buttonCancel')}</ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleSaveEdit}
              style={[styles.primaryButtonSmall, { backgroundColor: tint }]}> 
              <ThemedText style={styles.primaryButtonText}>{t('buttonSave')}</ThemedText>
            </Pressable>
          </View>
        </View>
      )}

      {editingField === field && field === 'password' && (
        <View style={styles.editPanel}>
          <ThemedText style={{ color: mutedText }}>{t('profilePasswordVerification')}</ThemedText>
          <View style={styles.selectionRow}>
            {renderSelectionChip(
              t('authLoginByEmail'),
              passwordDelivery === 'email',
              () => setPasswordDelivery('email'),
            )}
            {renderSelectionChip(
              t('authLoginByPhone'),
              passwordDelivery === 'phone',
              () => setPasswordDelivery('phone'),
            )}
          </View>
          <TextInput
            value={draftValue}
            onChangeText={setDraftValue}
            placeholder={t('profileNewPasswordPlaceholder')}
            placeholderTextColor={mutedText}
            secureTextEntry
            style={[styles.inputStandalone, { borderColor: border, color: mutedText }]}
          />
          <View style={styles.editActions}>
            <Pressable
              accessibilityRole="button"
              onPress={handleCancelEdit}
              style={[styles.secondaryButton, { borderColor: border }]}> 
              <ThemedText style={{ color: mutedText }}>{t('buttonCancel')}</ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleSaveEdit}
              style={[styles.primaryButtonSmall, { backgroundColor: tint }]}> 
              <ThemedText style={styles.primaryButtonText}>{t('buttonSave')}</ThemedText>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.container, { backgroundColor: background }]}
      contentContainerStyle={styles.content}>
      <View style={[styles.headerCard, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.headerTop}>
          <View style={[styles.avatar, { borderColor: border }]}>
            <MaterialCommunityIcons name="account-outline" size={30} color={mutedText} />
          </View>
          <View style={styles.identity}>
            <ThemedText type="pageTitle">{t('profileTitle')}</ThemedText>
            <ThemedText style={[styles.subtitle, { color: mutedText }]}>
              {userAccess.isGuest ? t('profileGuest') : t('profileConnected')} • {userAccess.status}
            </ThemedText>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: userAccess.status === 'PREMIUM' ? tint : background,
                borderColor: border,
              },
            ]}>
            <ThemedText style={{ color: userAccess.status === 'PREMIUM' ? '#FFFFFF' : mutedText }}>
              {userAccess.status}
            </ThemedText>
          </View>
        </View>
        {!userAccess.isGuest && (
          <Pressable
            accessibilityRole="button"
            onPress={signOut}
            style={({ pressed }) => [
              styles.signOut,
              { borderColor: border, opacity: pressed ? 0.7 : 1 },
            ]}>
            <MaterialCommunityIcons name="logout" size={16} color={mutedText} />
            <ThemedText style={{ color: mutedText }}>{t('profileSignOut')}</ThemedText>
          </Pressable>
        )}
      </View>

      {userAccess.isGuest ? (
        <View style={[styles.card, styles.elevatedCard, { backgroundColor: card, borderColor: border }]}>
          <View style={styles.cardHeader}>
            <ThemedText type="defaultSemiBold">
              {authMode === 'login' ? t('authLogin') : t('authSignup')}
            </ThemedText>
            <ThemedText style={{ color: mutedText }}>
              {authMode === 'login'
                ? 'Accède à ton espace MY TICKET en sécurité.'
                : 'Crée un compte pour profiter de toutes les fonctionnalités.'}
            </ThemedText>
          </View>
          <View style={[styles.authTabs, { backgroundColor: background, borderColor: border }]}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setAuthMode('login')}
              style={({ pressed }) => [
                styles.authTab,
                { backgroundColor: authMode === 'login' ? tint : 'transparent' },
                pressed && styles.pressedTab,
              ]}>
              <ThemedText style={{ color: authMode === 'login' ? '#FFFFFF' : mutedText }}>
                {t('authLogin')}
              </ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setAuthMode('signup')}
              style={({ pressed }) => [
                styles.authTab,
                { backgroundColor: authMode === 'signup' ? tint : 'transparent' },
                pressed && styles.pressedTab,
              ]}>
              <ThemedText style={{ color: authMode === 'signup' ? '#FFFFFF' : mutedText }}>
                {t('authSignup')}
              </ThemedText>
            </Pressable>
          </View>

          {authMode === 'login' ? (
            <View style={styles.formStack}>
              <View style={[styles.selectionRow, styles.miniSegment, { borderColor: border }]}>
                {renderSelectionChip(t('authLoginByEmail'), loginMethod === 'email', () => setLoginMethod('email'))}
                {renderSelectionChip(t('authLoginByPhone'), loginMethod === 'phone', () => setLoginMethod('phone'))}
              </View>

              {loginMethod === 'email' ? (
                <View style={styles.fieldGroup}>
                  <ThemedText type="defaultSemiBold">{t('authEmail')}</ThemedText>
                  <View style={[styles.inputShell, { borderColor: border }]}>
                    <MaterialCommunityIcons name="email-outline" size={18} color={mutedText} />
                    <TextInput
                      value={emailInput}
                      onChangeText={setEmailInput}
                      placeholder={t('authEmailPlaceholder')}
                      placeholderTextColor={mutedText}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      style={[styles.input, { color: mutedText }]}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.fieldGroup}>
                  <ThemedText type="defaultSemiBold">{t('authPhone')}</ThemedText>
                  <View style={styles.phoneRow}>
                    <View style={[styles.phoneCodeCard, { borderColor: border }]}> 
                      <ThemedText style={{ color: mutedText }}>{loginCountry.dialCode}</ThemedText>
                    </View>
                    <View style={[styles.inputShell, styles.phoneInput, { borderColor: border }]}>
                      <MaterialCommunityIcons name="phone-outline" size={18} color={mutedText} />
                      <TextInput
                        value={loginPhone}
                        onChangeText={setLoginPhone}
                        placeholder={t('authPhonePlaceholder')}
                        placeholderTextColor={mutedText}
                        keyboardType="phone-pad"
                        style={[styles.input, { color: mutedText }]}
                      />
                    </View>
                  </View>
                  <View style={styles.selectionGrid}>
                    {countries.map((country) =>
                      renderSelectionChip(
                        `${country.name} ${country.dialCode}`,
                        loginCountry.code === country.code,
                        () => setLoginCountry(country),
                      ),
                    )}
                  </View>
                </View>
              )}

              <View style={styles.fieldGroup}>
                <ThemedText type="defaultSemiBold">{t('authPassword')}</ThemedText>
                <View style={[styles.inputShell, { borderColor: border }]}>
                  <MaterialCommunityIcons name="lock-outline" size={18} color={mutedText} />
                  <TextInput
                    value={passwordInput}
                    onChangeText={setPasswordInput}
                    placeholder={t('authPasswordPlaceholder')}
                    placeholderTextColor={mutedText}
                    secureTextEntry
                    style={[styles.input, { color: mutedText }]}
                  />
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: tint, opacity: pressed ? 0.9 : 1 },
                ]}>
                <ThemedText style={styles.primaryButtonText}>{t('authLoginButton')}</ThemedText>
              </Pressable>
            </View>
          ) : (
            <View style={styles.formStack}>
              <View style={styles.splitFields}>
                <View style={styles.fieldGroupInline}>
                  <ThemedText type="defaultSemiBold">{t('authLastName')}</ThemedText>
                  <View style={[styles.inputShell, { borderColor: border }]}>
                    <MaterialCommunityIcons name="account-outline" size={18} color={mutedText} />
                    <TextInput
                      value={signupLastName}
                      onChangeText={setSignupLastName}
                      placeholder={t('authLastNamePlaceholder')}
                      placeholderTextColor={mutedText}
                      style={[styles.input, { color: mutedText }]}
                    />
                  </View>
                </View>
                <View style={styles.fieldGroupInline}>
                  <ThemedText type="defaultSemiBold">{t('authFirstName')}</ThemedText>
                  <View style={[styles.inputShell, { borderColor: border }]}>
                    <MaterialCommunityIcons name="account-outline" size={18} color={mutedText} />
                    <TextInput
                      value={signupFirstName}
                      onChangeText={setSignupFirstName}
                      placeholder={t('authFirstNamePlaceholder')}
                      placeholderTextColor={mutedText}
                      style={[styles.input, { color: mutedText }]}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <ThemedText type="defaultSemiBold">{t('authEmail')}</ThemedText>
                <View style={[styles.inputShell, { borderColor: border }]}>
                  <MaterialCommunityIcons name="email-outline" size={18} color={mutedText} />
                  <TextInput
                    value={signupEmail}
                    onChangeText={setSignupEmail}
                    placeholder={t('authEmailPlaceholder')}
                    placeholderTextColor={mutedText}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={[styles.input, { color: mutedText }]}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <ThemedText type="defaultSemiBold">{t('authPhone')}</ThemedText>
                <View style={styles.phoneRow}>
                  <View style={[styles.phoneCodeCard, { borderColor: border }]}> 
                    <ThemedText style={{ color: mutedText }}>{signupCountry.dialCode}</ThemedText>
                  </View>
                  <View style={[styles.inputShell, styles.phoneInput, { borderColor: border }]}>
                    <MaterialCommunityIcons name="phone-outline" size={18} color={mutedText} />
                    <TextInput
                      value={signupPhone}
                      onChangeText={setSignupPhone}
                      placeholder={t('authPhonePlaceholder')}
                      placeholderTextColor={mutedText}
                      keyboardType="phone-pad"
                      style={[styles.input, { color: mutedText }]}
                    />
                  </View>
                </View>
                <View style={styles.selectionGrid}>
                  {countries.map((country) =>
                    renderSelectionChip(
                      `${country.name} ${country.dialCode}`,
                      signupCountry.code === country.code,
                      () => {
                        setSignupCountry(country);
                        setSignupCity(country.cities[0]);
                      },
                    ),
                  )}
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <ThemedText type="defaultSemiBold">{t('authPassword')}</ThemedText>
                <View style={[styles.inputShell, { borderColor: border }]}>
                  <MaterialCommunityIcons name="lock-outline" size={18} color={mutedText} />
                  <TextInput
                    value={signupPassword}
                    onChangeText={setSignupPassword}
                    placeholder={t('authPasswordPlaceholder')}
                    placeholderTextColor={mutedText}
                    secureTextEntry
                    style={[styles.input, { color: mutedText }]}
                  />
                </View>
                <ThemedText style={styles.helperText}>{t('authPasswordRequirements')}</ThemedText>
              </View>

              <View style={styles.fieldGroup}>
                <ThemedText type="defaultSemiBold">{t('authCountry')}</ThemedText>
                <View style={styles.selectionGrid}>
                  {countries.map((country) =>
                    renderSelectionChip(
                      country.name,
                      signupCountry.code === country.code,
                      () => {
                        setSignupCountry(country);
                        setSignupCity(country.cities[0]);
                      },
                    ),
                  )}
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <ThemedText type="defaultSemiBold">{t('authCity')}</ThemedText>
                <View style={styles.selectionGrid}>
                  {signupCountry.cities.map((city) =>
                    renderSelectionChip(city, signupCity === city, () => setSignupCity(city)),
                  )}
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={handleSignup}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: tint, opacity: pressed ? 0.9 : 1 },
                ]}>
                <ThemedText style={styles.primaryButtonText}>{t('authSignupButton')}</ThemedText>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <ThemedText type="defaultSemiBold">{t('profileInfoTitle')}</ThemedText>
          {renderEditableRow(t('profileUserId'), userProfile.userId, 'userId')}
          {renderEditableRow(t('profileLastName'), userProfile.lastName, 'lastName')}
          {renderEditableRow(t('profileFirstName'), userProfile.firstName, 'firstName')}
          {renderEditableRow(t('profileEmail'), userProfile.email, 'email')}
          {renderEditableRow(t('profilePhone'), userProfile.phone, 'phone')}
          {renderEditableRow(t('profilePassword'), userProfile.password, 'password', true)}
          {renderEditableRow(t('profileCountry'), userProfile.country, 'country')}
          {renderEditableRow(t('profileCity'), userProfile.city, 'city')}
        </View>
      )}

      {!userAccess.isGuest && (
        <ThemedText style={{ color: success }}>{t('authSuccess')}</ThemedText>
      )}

      <View style={[styles.card, styles.elevatedCard, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardHeaderRow}>
          <View>
            <ThemedText type="defaultSemiBold">{t('subscriptionCardTitle')}</ThemedText>
            <ThemedText style={{ color: mutedText }}>
              {userAccess.status === 'PREMIUM'
                ? t('subscriptionCardSubtitlePremium')
                : t('subscriptionCardSubtitleFree')}
            </ThemedText>
          </View>
          <View style={[styles.premiumBadge, { borderColor: border, backgroundColor: background }]}>
            <MaterialCommunityIcons name="star-four-points" size={14} color={tint} />
            <ThemedText style={{ color: tint }}>Premium</ThemedText>
          </View>
        </View>
        <ThemedText style={[styles.helperText, { color: mutedText }]}>
          +3 pronos premium • stats avancées • ticket rapide
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/subscription')}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: tint, opacity: pressed ? 0.9 : 1 },
          ]}>
          <ThemedText style={styles.primaryButtonText}>{t('buttonSeeOffers')}</ThemedText>
        </Pressable>
      </View>

      <View style={[styles.card, styles.elevatedCard, { backgroundColor: card, borderColor: border }]}>
        <ThemedText type="defaultSemiBold">{t('shortcutsTitle')}</ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [
            styles.actionRow,
            { borderColor: border, backgroundColor: pressed ? background : 'transparent' },
          ]}>
          <View style={styles.actionRowContent}>
            <View style={[styles.iconBubble, { backgroundColor: background }]}>
              <MaterialCommunityIcons name="cog-outline" size={18} color={tint} />
            </View>
            <View style={styles.actionTextStack}>
              <ThemedText>{t('buttonSettings')}</ThemedText>
              <ThemedText style={[styles.actionSubtitle, { color: mutedText }]}>
                Gérer ton compte, thème, préférences
              </ThemedText>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={mutedText} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/support')}
          style={({ pressed }) => [
            styles.actionRow,
            { borderColor: border, backgroundColor: pressed ? background : 'transparent' },
          ]}>
          <View style={styles.actionRowContent}>
            <View style={[styles.iconBubble, { backgroundColor: background }]}>
              <MaterialCommunityIcons name="help-circle-outline" size={18} color={tint} />
            </View>
            <View style={styles.actionTextStack}>
              <ThemedText>{t('buttonSupport')}</ThemedText>
              <ThemedText style={[styles.actionSubtitle, { color: mutedText }]}>
                Besoin d’aide ? Support & FAQ rapides
              </ThemedText>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={mutedText} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/legal')}
          style={({ pressed }) => [
            styles.actionRow,
            { borderColor: border, backgroundColor: pressed ? background : 'transparent' },
          ]}>
          <View style={styles.actionRowContent}>
            <View style={[styles.iconBubble, { backgroundColor: background }]}>
              <MaterialCommunityIcons name="file-document-outline" size={18} color={tint} />
            </View>
            <View style={styles.actionTextStack}>
              <ThemedText>{t('legalTitle')}</ThemedText>
              <ThemedText style={[styles.actionSubtitle, { color: mutedText }]}>
                CGU, mentions légales, politique
              </ThemedText>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={mutedText} />
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
    paddingTop: 32,
    paddingHorizontal: 18,
    gap: 18,
    paddingBottom: 48,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 14,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    justifyContent: 'space-between',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  identity: {
    gap: 6,
    flex: 1,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  subtitle: {
    textAlign: 'left',
  },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 14,
  },
  elevatedCard: {
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  cardHeader: {
    gap: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authTabs: {
    flexDirection: 'row',
    borderRadius: 18,
    padding: 4,
    gap: 6,
    borderWidth: 1,
  },
  authTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
  },
  pressedTab: {
    opacity: 0.9,
  },
  formStack: {
    gap: 16,
  },
  splitFields: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldGroupInline: {
    flex: 1,
    gap: 8,
  },
  inputShell: {
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 6,
  },
  inputStandalone: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 16,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  phoneCodeCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minWidth: 76,
    alignItems: 'center',
  },
  phoneInput: {
    flex: 1,
  },
  selectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  miniSegment: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 4,
  },
  selectionChip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  primaryButton: {
    marginTop: 4,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonSmall: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  actionRow: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextStack: {
    gap: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  infoRow: {
    gap: 6,
    paddingVertical: 6,
  },
  infoRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editButton: {
    padding: 4,
  },
  editPanel: {
    gap: 10,
    marginTop: 6,
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
});
