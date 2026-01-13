import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

import { ThemedText } from './ThemedText';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function ScreenHeader({ title, subtitle, containerStyle }: ScreenHeaderProps) {
  const border = useThemeColor({}, 'border');
  const mutedText = useThemeColor({}, 'mutedText');
  const card = useThemeColor({}, 'card');

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => router.back()}
        style={[styles.backButton, { borderColor: border, backgroundColor: card }]}>
        <MaterialCommunityIcons name="chevron-left" size={22} color={mutedText} />
      </TouchableOpacity>
      <View style={styles.textBlock}>
        <ThemedText type="pageTitle">{title}</ThemedText>
        {subtitle ? <ThemedText style={[styles.subtitle, { color: mutedText }]}>{subtitle}</ThemedText> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 16,
  },
  textBlock: {
    gap: 4,
    alignItems: 'center',
    paddingHorizontal: 44,
  },
  subtitle: {
    textAlign: 'center',
  },
});
