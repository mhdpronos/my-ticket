import { StyleSheet, Text, type TextProps } from 'react-native';

const ONE_X_BET_BLUE = '#1E5AA7';

export function BrandTitle({ style, ...rest }: TextProps) {
  return (
    <Text style={[styles.title, style]} {...rest}>
      <Text style={styles.my}>MY</Text>
      <Text style={styles.ticket}>TICKET</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -1,
    textAlign: 'center',
  },
  my: {
    color: '#FFFFFF',
  },
  ticket: {
    color: ONE_X_BET_BLUE,
  },
});
