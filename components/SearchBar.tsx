import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => (
  <View style={styles.container}>
    <MaterialCommunityIcons name="magnify" size={20} color={Colors.dark.muted} />
    <TextInput
      placeholder={placeholder ?? 'Rechercher un match'}
      placeholderTextColor={Colors.dark.muted}
      value={value}
      onChangeText={onChange}
      style={styles.input}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.dark.card,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 14,
  },
});
