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
  const mutedText = useThemeColor({}, 'mutedText');
  const card = useThemeColor({}, 'card');
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.titleBar, { backgroundColor: tint }]}>
        <ThemedText type="title" style={styles.titleText}>
          {title}
        </ThemedText>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.back()}
          style={[styles.backButton, { borderColor: '#FFFFFF', backgroundColor: card }]}>
          <MaterialCommunityIcons name="chevron-left" size={22} color={mutedText} />
        </TouchableOpacity>
      </View>
      {subtitle ? <ThemedText style={[styles.subtitleText, { color: mutedText }]}>{subtitle}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 6,
    alignItems: 'center',
  },
  titleBar: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitleText: {
    textAlign: 'center',
  },
});
