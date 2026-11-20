import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import AppButton from '../components/AppButton';
import ScreenContainer from '../components/ScreenContainer';
import { strings } from '../constants/strings';
import { colors, radius, spacing } from '../constants/theme';

const SPINNER_SIZE = 110;
const SPIN_DURATION = 1000;
const PROGRESS_DURATION = 4000;

function LoadingIndicator() {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);
  const progress = useSharedValue(0);
  const [percent, setPercent] = useState(0);

  // Inicia automáticamente al montar el componente
  useEffect(() => {
    // Spinner infinito
    rotation.value = withRepeat(
      withTiming(360, { duration: SPIN_DURATION, easing: Easing.linear }),
      -1,
      false,
    );
    // Pulso suave del centro
    pulse.value = withRepeat(
      withSequence(withTiming(0.85, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1,
      true,
    );
    // Barra de progreso simultánea (se repite para demostrar la animación)
    progress.value = withRepeat(
      withTiming(1, { duration: PROGRESS_DURATION, easing: Easing.inOut(Easing.cubic) }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(rotation);
      cancelAnimation(pulse);
      cancelAnimation(progress);
    };
  }, [rotation, pulse, progress]);

  // Actualiza el porcentaje visible solo cuando cambia el valor entero
  useAnimatedReaction(
    () => Math.round(progress.value * 100),
    (current, previous) => {
      if (current !== previous) {
        scheduleOnRN(setPercent, current);
      }
    },
  );

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.spinnerBox}>
        <Animated.View style={[styles.spinner, spinnerStyle]} />
        <Animated.View style={[styles.inner, innerStyle]} />
      </View>

      <Text style={styles.label}>
        {strings.loading.loading}… {percent}%
      </Text>

      <View style={styles.track}>
        <Animated.View style={[styles.bar, barStyle]} />
      </View>
    </View>
  );
}

export default function LoadingScreen() {
  // Cambiar la key vuelve a montar el componente y reinicia las animaciones
  const [mountKey, setMountKey] = useState(0);

  return (
    <ScreenContainer hint={strings.loading.hint}>
      <LoadingIndicator key={mountKey} />
      <View style={styles.footer}>
        <AppButton
          label={strings.loading.restart}
          onPress={() => setMountKey((k) => k + 1)}
          color={colors.surfaceAlt}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  spinnerBox: {
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    position: 'absolute',
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    borderRadius: SPINNER_SIZE / 2,
    borderWidth: 10,
    borderColor: colors.track,
    borderTopColor: colors.primary,
    borderRightColor: colors.secondary,
  },
  inner: {
    width: SPINNER_SIZE / 3,
    height: SPINNER_SIZE / 3,
    borderRadius: SPINNER_SIZE / 6,
    backgroundColor: colors.accent,
  },
  label: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  track: {
    alignSelf: 'stretch',
    height: 14,
    borderRadius: radius.round,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: radius.round,
    backgroundColor: colors.secondary,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});
