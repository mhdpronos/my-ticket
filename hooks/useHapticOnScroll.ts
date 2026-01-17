import { useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

type HapticScrollOptions = {
  minIntervalMs?: number;
};

export const useHapticOnScroll = (options: HapticScrollOptions = {}) => {
  const { minIntervalMs = 120 } = options;
  const lastTriggerRef = useRef(0);

  const trigger = useCallback(() => {
    if (Platform.OS === 'web') {
      return;
    }
    const now = Date.now();
    if (now - lastTriggerRef.current < minIntervalMs) {
      return;
    }
    lastTriggerRef.current = now;
    void Haptics.selectionAsync();
  }, [minIntervalMs]);

  const onScrollBeginDrag = useCallback(() => {
    trigger();
  }, [trigger]);

  const onMomentumScrollBegin = useCallback(() => {
    trigger();
  }, [trigger]);

  return {
    onScrollBeginDrag,
    onMomentumScrollBegin,
  };
};
