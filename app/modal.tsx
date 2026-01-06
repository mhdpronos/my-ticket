import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';

export default function EcranFenetreModale() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Ceci est une fenêtre modale</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Retourner à accueil</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
