import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { TexteTheme } from '@/composants/texte-theme';
import { VueTheme } from '@/composants/vue-theme';

export default function EcranFenetreModale() {
  return (
    <VueTheme style={styles.container}>
      <TexteTheme type="title">Ceci est une fenêtre modale</TexteTheme>
      <Link href="/" dismissTo style={styles.link}>
        <TexteTheme type="link">Retourner à l'accueil</TexteTheme>
      </Link>
    </VueTheme>
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
