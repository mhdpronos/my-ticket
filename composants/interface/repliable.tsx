import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { TexteTheme } from '@/composants/texte-theme';
import { VueTheme } from '@/composants/vue-theme';
import { SymboleIcone } from '@/composants/interface/symbole-icone';
import { Colors } from '@/constantes/theme';
import { useSchemaCouleur } from '@/crochets/utiliser-schema-couleur';

export function Repliable({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useSchemaCouleur() ?? 'light';

  return (
    <VueTheme>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <SymboleIcone
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <TexteTheme type="defaultSemiBold">{title}</TexteTheme>
      </TouchableOpacity>
      {isOpen && <VueTheme style={styles.content}>{children}</VueTheme>}
    </VueTheme>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
