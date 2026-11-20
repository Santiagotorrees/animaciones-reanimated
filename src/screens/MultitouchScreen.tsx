import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  GestureDetector,
  usePanGesture,
  usePinchGesture,
  useRotationGesture,
  useSimultaneousGestures,
  useTapGesture,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import AppButton from '../components/AppButton';
import ScreenContainer from '../components/ScreenContainer';
import { strings } from '../constants/strings';
import { colors, radius, spacing } from '../constants/theme';

const IMAGE_SIZE = 260;
const MIN_SCALE = 0.5;
const MAX_SCALE = 4;

const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

export default function MultitouchScreen() {
  // Traslación
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  // Escala (zoom)
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  // Rotación en radianes
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const [info, setInfo] = useState({ scale: 1, rotation: 0 });

  const reset = () => {
    'worklet';
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
    rotation.value = withSpring(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    savedScale.value = 1;
    savedRotation.value = 0;
  };

  // Mover
  const pan = usePanGesture({
    onUpdate: (event) => {
      'worklet';
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    },
    onDeactivate: () => {
      'worklet';
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    },
  });

  // Acercar / alejar
  const pinch = usePinchGesture({
    onUpdate: (event) => {
      'worklet';
      scale.value = clamp(savedScale.value * event.scale, MIN_SCALE, MAX_SCALE);
    },
    onDeactivate: () => {
      'worklet';
      savedScale.value = scale.value;
    },
  });

  // Rotar
  const rotate = useRotationGesture({
    onUpdate: (event) => {
      'worklet';
      rotation.value = savedRotation.value + event.rotation;
    },
    onDeactivate: () => {
      'worklet';
      savedRotation.value = rotation.value;
    },
  });

  // Doble toque para restablecer
  const doubleTap = useTapGesture({
    numberOfTaps: 2,
    onActivate: () => {
      'worklet';
      reset();
    },
  });

  // Mover, escalar y rotar funcionan al mismo tiempo (multitouch)
  const gesture = useSimultaneousGestures(pan, pinch, rotate, doubleTap);

  useAnimatedReaction(
    () => ({
      scale: Math.round(scale.value * 100) / 100,
      rotation: Math.round((rotation.value * 180) / Math.PI),
    }),
    (current, previous) => {
      if (!previous || current.scale !== previous.scale || current.rotation !== previous.rotation) {
        scheduleOnRN(setInfo, current);
      }
    },
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  return (
    <ScreenContainer hint={strings.multitouch.hint}>
      <GestureDetector gesture={gesture}>
        <View style={styles.area} collapsable={false}>
          <Animated.Image
            source={require('../../assets/paisaje.png')}
            style={[styles.image, animatedStyle]}
            resizeMode="cover"
          />
        </View>
      </GestureDetector>

      <View style={styles.footer}>
        <Text style={styles.info}>
          {strings.multitouch.scale}: {info.scale.toFixed(2)}x · {strings.multitouch.rotation}:{' '}
          {info.rotation}°
        </Text>
        <AppButton label={strings.multitouch.reset} onPress={() => reset()} color={colors.surfaceAlt} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: radius.lg,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  info: {
    color: colors.textMuted,
    marginBottom: spacing.md,
    fontSize: 14,
  },
});
