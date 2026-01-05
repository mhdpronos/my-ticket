import React from 'react';
import { Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

export const HeaderNotificationsButton = () => {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push('/notifications')} hitSlop={10}>
      <MaterialCommunityIcons name="bell-outline" size={22} color={Colors.dark.accentSoft} />
    </Pressable>
  );
};
