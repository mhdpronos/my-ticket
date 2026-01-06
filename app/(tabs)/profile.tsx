import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setAccess } = useUserStore();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Profil</Text>
      <View style={styles.card}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.status}>Statut : {user.access}</Text>
        {user.access === 'FREE' ? (
          <Pressable style={styles.primaryButton} onPress={() => router.push('/subscription')}>
            <Text style={styles.primaryButtonText}>Passer Premium</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.secondaryButton} onPress={() => setAccess('FREE')}>
            <Text style={styles.secondaryButtonText}>Revenir en gratuit</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.menu}>
        <Pressable style={styles.menuItem} onPress={() => router.push('/history')}>
          <Text style={styles.menuText}>Historique</Text>
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => router.push('/settings')}>
          <Text style={styles.menuText}>Réglages</Text>
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => router.push('/support')}>
          <Text style={styles.menuText}>Aide & Support</Text>
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => router.push('/legal')}>
          <Text style={styles.menuText}>Mentions légales</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.dark.card,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: Spacing.sm,
  },
  name: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '700',
  },
  status: {
    color: Colors.dark.muted,
  },
  primaryButton: {
    backgroundColor: Colors.dark.accent,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.dark.background,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.dark.muted,
    fontWeight: '600',
  },
  menu: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  menuItem: {
    backgroundColor: Colors.dark.card,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  menuText: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
});
