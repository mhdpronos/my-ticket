import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Colors, Radius } from '@/constants/theme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet = ({ visible, onClose, children }: BottomSheetProps) => {
  const translateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const sheetHeight = useMemo(() => Dimensions.get('window').height * 0.7, []);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? Dimensions.get('window').height - sheetHeight : Dimensions.get('window').height,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [sheetHeight, translateY, visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.sheet, { height: sheetHeight, transform: [{ translateY }] }]}> 
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.dark.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 60,
    height: 4,
    borderRadius: 999,
    backgroundColor: Colors.dark.border,
    marginBottom: 12,
  },
});
