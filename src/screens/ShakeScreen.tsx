import { Accelerometer } from 'expo-sensors';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import AppButton from '../components/AppButton';
import ScreenContainer from '../components/ScreenContainer';
import { strings } from '../constants/strings';
import { colors, radius, spacing } from '../constants/theme';

const SHAPE_SIZE = 140;
const UPDATE_INTERVAL_MS = 100;
// Umbral de fuerza (en g) para considerar que el dispositivo fue agitado
const SHAKE_THRESHOLD = 1.8;
// Tiempo mínimo entre sacudidas detectadas
const SHAKE_COOLDOWN_MS = 800;
const OFFSET = 18;
const STEP = 50;

export default function ShakeScreen() {
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const [available, setAvailable] = useState(true);
  const [shakes, setShakes] = useState(0);
  const [force, setForce] = useState(0);
  const lastShake = useRef(0);

  const shake = useCallback(() => {
    const timing = { duration: STEP, easing: Easing.inOut(Easing.quad) };
    translateX.value = withSequence(
      withTiming(-OFFSET, timing),
      withTiming(OFFSET, timing),
      withTiming(-OFFSET, timing),
      withTiming(OFFSET, timing),
      withTiming(-OFFSET / 2, timing),
      withTiming(OFFSET / 2, timing),
      withTiming(0, timing),
    );
    rotation.value = withSequence(
      withTiming(-12, timing),
      withTiming(12, timing),
      withTiming(-10, timing),
      withTiming(10, timing),
      withTiming(-5, timing),
      withTiming(5, timing),
      withTiming(0, timing),
    );
    scale.value = withSequence(withTiming(1.15, { duration: 120 }), withSpring(1));
    setShakes((s) => s + 1);
  }, [translateX, rotation, scale]);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    let mounted = true;

    const start = async () => {
      const isAvailable = await Accelerometer.isAvailableAsync().catch(() => false);
      if (!mounted) return;
      setAvailable(isAvailable);
      if (!isAvailable) return;

      try {
        Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);
        subscription = Accelerometer.addListener(({ x, y, z }) => {
        // Magnitud total de la aceleración (en reposo ≈ 1 g por la gravedad)
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        setForce(magnitude);

        const now = Date.now();
        if (magnitude > SHAKE_THRESHOLD && now - lastShake.current > SHAKE_COOLDOWN_MS) {
          lastShake.current = now;
          shake();
        }
        });
      } catch {
        setAvailable(false);
      }
    };

    start();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, [shake]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <ScreenContainer hint={available ? strings.shake.hint : strings.shake.unavailable}>
      <Animated.View style={[styles.shape, animatedStyle]}>
        <Text style={styles.emoji}>📳</Text>
      </Animated.View>

      <View style={styles.stats}>
        <Text style={styles.stat}>
          {strings.shake.shakes}: {shakes}
        </Text>
        <Text style={styles.stat}>
          {strings.shake.force}: {force.toFixed(2)}
        </Text>
      </View>

      <View style={styles.footer}>
        <AppButton label={strings.shake.simulate} onPress={shake} color={colors.surfaceAlt} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  shape: {
    width: SHAPE_SIZE,
    height: SHAPE_SIZE,
    borderRadius: radius.lg,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  emoji: {
    fontSize: 56,
  },
  stats: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  stat: {
    color: colors.textMuted,
    fontSize: 15,
    marginVertical: 2,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xl,
  },
});
