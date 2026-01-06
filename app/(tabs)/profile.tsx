// Le code de la page profil avec authentification locale.
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useState } from 'react';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppStore } from '@/store/useAppStore';

export default function ProfileScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');
  const success = useThemeColor({}, 'success');

  const userAccess = useAppStore((state) => state.userAccess);
  const userProfile = useAppStore((state) => state.userProfile);
  const setUserAccess = useAppStore((state) => state.setUserAccess);
  const updateUserProfile = useAppStore((state) => state.updateUserProfile);
  const signOut = useAppStore((state) => state.signOut);

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState(userProfile.email);
  const [passwordInput, setPasswordInput] = useState('');

  const handleAuth = () => {
    updateUserProfile({ email: emailInput });
    setUserAccess({ status: 'FREE', isGuest: false });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={[styles.avatar, { borderColor: border }]}> 
          <MaterialCommunityIcons name="account-outline" size={30} color={mutedText} />
        </View>
        <View style={styles.identity}>
          <ThemedText type="title">Profil</ThemedText>
          <ThemedText style={{ color: mutedText }}>
            {userAccess.isGuest ? 'Compte invité' : 'Compte connecté'} • {userAccess.status}
          </ThemedText>
        </View>
        {!userAccess.isGuest && (
          <Pressable
            accessibilityRole="button"
            onPress={signOut}
            style={[styles.signOut, { borderColor: border }]}> 
            <MaterialCommunityIcons name="logout" size={16} color={mutedText} />
            <ThemedText style={{ color: mutedText }}>Sortir</ThemedText>
          </Pressable>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}> 
        <View style={styles.authTabs}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setAuthMode('login')}
            style={[styles.authTab, { backgroundColor: authMode === 'login' ? tint : background }]}> 
            <ThemedText style={{ color: authMode === 'login' ? '#FFFFFF' : mutedText }}>Connexion</ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setAuthMode('signup')}
            style={[styles.authTab, { backgroundColor: authMode === 'signup' ? tint : background }]}> 
            <ThemedText style={{ color: authMode === 'signup' ? '#FFFFFF' : mutedText }}>Inscription</ThemedText>
          </Pressable>
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText type="defaultSemiBold">Email</ThemedText>
          <TextInput
            value={emailInput}
            onChangeText={setEmailInput}
            placeholder="nom@email.com"
            placeholderTextColor={mutedText}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, { borderColor: border, color: mutedText }]}
          />
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText type="defaultSemiBold">Mot de passe</ThemedText>
          <TextInput
            value={passwordInput}
            onChangeText={setPasswordInput}
            placeholder="••••••••"
            placeholderTextColor={mutedText}
            secureTextEntry
            style={[styles.input, { borderColor: border, color: mutedText }]}
          />
        </View>

        {authMode === 'signup' && (
          <View style={styles.fieldGroup}>
            <ThemedText type="defaultSemiBold">Nom complet</ThemedText>
            <TextInput
              value={userProfile.fullName}
              onChangeText={(value) => updateUserProfile({ fullName: value })}
              placeholder="Prénom Nom"
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
            {authMode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </ThemedText>
        </Pressable>

        {!userAccess.isGuest && (
          <ThemedText style={{ color: success }}>Connexion réussie, accès activé.</ThemedText>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}> 
        <ThemedText type="defaultSemiBold">Mes informations</ThemedText>
        <View style={styles.fieldGroup}>
          <ThemedText>Ville</ThemedText>
          <TextInput
            value={userProfile.city}
            onChangeText={(value) => updateUserProfile({ city: value })}
            placeholder="Paris"
            placeholderTextColor={mutedText}
            style={[styles.input, { borderColor: border, color: mutedText }]}
          />
        </View>
        <View style={styles.fieldGroup}>
          <ThemedText>Téléphone</ThemedText>
          <TextInput
            value={userProfile.phone}
            onChangeText={(value) => updateUserProfile({ phone: value })}
            placeholder="+33 6 00 00 00 00"
            placeholderTextColor={mutedText}
            keyboardType="phone-pad"
            style={[styles.input, { borderColor: border, color: mutedText }]}
          />
        </View>
        <View style={styles.fieldGroup}>
          <ThemedText>Club préféré</ThemedText>
          <TextInput
            value={userProfile.favoriteTeam}
            onChangeText={(value) => updateUserProfile({ favoriteTeam: value })}
            placeholder="PSG, Marseille..."
            placeholderTextColor={mutedText}
            style={[styles.input, { borderColor: border, color: mutedText }]}
          />
        </View>
        <View style={styles.fieldGroup}>
          <ThemedText>Date de naissance</ThemedText>
          <TextInput
            value={userProfile.birthDate}
            onChangeText={(value) => updateUserProfile({ birthDate: value })}
            placeholder="JJ/MM/AAAA"
            placeholderTextColor={mutedText}
            style={[styles.input, { borderColor: border, color: mutedText }]}
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}> 
        <ThemedText type="defaultSemiBold">Abonnement</ThemedText>
        <ThemedText style={{ color: mutedText }}>
          {userAccess.status === 'PREMIUM' ? 'Premium actif' : 'Passe en Premium pour débloquer +3 pronos'}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/subscription')}
          style={[styles.primaryButton, { backgroundColor: tint }]}> 
          <ThemedText style={styles.primaryButtonText}>Voir les offres</ThemedText>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}> 
        <ThemedText type="defaultSemiBold">Raccourcis</ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/settings')}
          style={[styles.actionRow, { borderColor: border }]}> 
          <View style={styles.actionRowContent}>
            <MaterialCommunityIcons name="cog-outline" size={18} color={tint} />
            <ThemedText>Réglages</ThemedText>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/support')}
          style={[styles.actionRow, { borderColor: border }]}> 
          <View style={styles.actionRowContent}>
            <MaterialCommunityIcons name="help-circle-outline" size={18} color={tint} />
            <ThemedText>Aide & support</ThemedText>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color={mutedText} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/legal')}
          style={[styles.actionRow, { borderColor: border }]}> 
          <View style={styles.actionRowContent}>
            <MaterialCommunityIcons name="file-document-outline" size={18} color={tint} />
            <ThemedText>Mentions légales</ThemedText>
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
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
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
    flex: 1,
    gap: 4,
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
