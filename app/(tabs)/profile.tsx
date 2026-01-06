import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppStore } from '@/store/useAppStore';

export default function ProfileScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const tint = useThemeColor({}, 'tint');

  const userAccess = useAppStore((state) => state.userAccess);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 16,
    gap: 16,
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
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    marginTop: 4,
    borderRadius: 12,
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
