import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function OnboardingScreen() {
  const background = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');
  const mutedText = useThemeColor({}, 'mutedText');

  return (
    <View style={[styles.container, { backgroundColor: background }]}> 
      <View style={styles.content}>
        <ThemedText type="title">MY TICKET</ThemedText>
        <ThemedText style={{ color: mutedText }}>
          Crée ton ticket. Compare les cotes. Parie où tu veux.
        </ThemedText>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace('/matches')}
        style={[styles.primaryButton, { backgroundColor: tint }]}>
        <ThemedText style={styles.primaryButtonText}>Commencer</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 24,
  },
  content: {
    gap: 10,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
