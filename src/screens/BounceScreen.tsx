import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector, useTapGesture } from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import ScreenContainer from '../components/ScreenContainer';
import { strings } from '../constants/strings';
import { colors, spacing } from '../constants/theme';

const SHAPE_SIZE = 170;
const PRESSED_SCALE = 0.75;

// Resorte poco amortiguado para un rebote visible
const BOUNCE_SPRING = { damping: 4, stiffness: 220, mass: 0.8 };

export default function BounceScreen() {
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);
  const [count, setCount] = useState(0);

  const increment = () => setCount((c) => c + 1);

  const tap = useTapGesture({
    maxDuration: 60000, // permite mantener presionado
    shouldCancelWhenOutside: false,
    onBegin: () => {
      'worklet';
      // Al presionar: se reduce
      scale.value = withTiming(PRESSED_SCALE, { duration: 120 });
      pressed.value = withTiming(1, { duration: 120 });
    },
    onActivate: () => {
      'worklet';
      scheduleOnRN(increment);
    },
    onFinalize: () => {
      'worklet';
      // Al soltar: vuelve al tamaño original con rebote
      scale.value = withSpring(1, BOUNCE_SPRING);
      pressed.value = withTiming(0, { duration: 250 });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(pressed.value, [0, 1], [colors.accent, colors.warning]),
  }));

  return (
    <ScreenContainer hint={strings.bounce.hint}>
      <GestureDetector gesture={tap}>
        <Animated.View style={[styles.shape, animatedStyle]}>
          <Text style={styles.label}>{strings.bounce.press}</Text>
        </Animated.View>
      </GestureDetector>
      <View style={styles.footer}>
        <Text style={styles.counter}>
          {strings.bounce.counter}: {count}
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  shape: {
    width: SHAPE_SIZE,
    height: SHAPE_SIZE,
    borderRadius: SHAPE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
  },
  label: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 18,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xl,
  },
  counter: {
    color: colors.textMuted,
    fontSize: 16,
  },
});
