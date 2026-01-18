import { useCallback, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

type HapticScrollOptions = {
  minIntervalMs?: number;
  minScrollDistance?: number;
};

export const useHapticOnScroll = (options: HapticScrollOptions = {}) => {
  const { minIntervalMs = 120, minScrollDistance = 80 } = options;
  const lastTriggerRef = useRef(0);
  const lastOffsetRef = useRef({ x: 0, y: 0 });
  const hasOffsetRef = useRef(false);
  const distanceRef = useRef(0);

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

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { x, y } = event.nativeEvent.contentOffset;
      if (!hasOffsetRef.current) {
        hasOffsetRef.current = true;
        lastOffsetRef.current = { x, y };
        return;
      }

      const lastOffset = lastOffsetRef.current;
      const deltaX = Math.abs(x - lastOffset.x);
      const deltaY = Math.abs(y - lastOffset.y);
      lastOffsetRef.current = { x, y };
      distanceRef.current += Math.max(deltaX, deltaY);

      if (distanceRef.current < minScrollDistance) {
        return;
      }

      distanceRef.current = 0;
      trigger();
    },
    [minScrollDistance, trigger],
  );

  const onScrollBeginDrag = useCallback(() => {
    trigger();
  }, [trigger]);

  const onMomentumScrollBegin = useCallback(() => {
    trigger();
  }, [trigger]);

  return {
    onScroll,
    onScrollBeginDrag,
    onMomentumScrollBegin,
    scrollEventThrottle: 16,
  };
};
