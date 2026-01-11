import { Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

type SessionItem = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
};

const initialSessions: SessionItem[] = [
  { id: 'current', device: 'iPhone 14 Pro', location: 'Abidjan, CI', lastActive: 'Actif maintenant', current: true },
  { id: 'session-2', device: 'Samsung Galaxy S23', location: 'Lomé, TG', lastActive: 'Actif il y a 2h' },
  { id: 'session-3', device: 'Web Chrome', location: 'Dakar, SN', lastActive: 'Actif hier' },
];

export default function SessionsScreen() {
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const danger = useThemeColor({}, 'danger');
  const tint = useThemeColor({}, 'tint');

  const [sessions, setSessions] = useState(initialSessions);

  const handleSignOutSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScreenHeader title="Sessions actives" subtitle="Gère les appareils connectés à ton compte." />
      <View style={styles.list}>
        {sessions.map((session) => (
          <View key={session.id} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="devices" size={20} color={tint} />
              <View style={styles.cardText}>
                <ThemedText type="defaultSemiBold">{session.device}</ThemedText>
                <ThemedText style={{ color: mutedText }}>{session.location}</ThemedText>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <ThemedText style={{ color: mutedText }}>{session.lastActive}</ThemedText>
              {session.current ? (
                <ThemedText style={{ color: tint }}>Cette session</ThemedText>
              ) : (
                <Pressable onPress={() => handleSignOutSession(session.id)} style={styles.disconnectButton}>
                  <MaterialCommunityIcons name="logout" size={16} color={danger} />
                  <ThemedText style={{ color: danger }}>Déconnecter</ThemedText>
                </Pressable>
              )}
            </View>
          </View>
        ))}
        {sessions.length === 0 ? (
          <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <ThemedText type="defaultSemiBold">Aucune session active</ThemedText>
            <ThemedText style={{ color: mutedText }}>
              Toutes les sessions ont été déconnectées avec succès.
            </ThemedText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
