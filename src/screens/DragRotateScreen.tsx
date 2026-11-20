import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import AppButton from '../components/AppButton';
import ScreenContainer from '../components/ScreenContainer';
import { strings } from '../constants/strings';
import { colors, radius, spacing } from '../constants/theme';

const SHAPE_SIZE = 130;
const MAX_ROTATION = 35;
const ROTATION_DISTANCE = 160;

export default function DragRotateScreen() {
  // Posición acumulada de la figura
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  // Desplazamiento del gesto activo
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  // Rotación en grados según la dirección del arrastre
  const rotation = useSharedValue(0);
  // Escala para indicar que la figura está "tomada"
  const lifted = useSharedValue(1);

  const pan = usePanGesture({
    onBegin: () => {
      'worklet';
      lifted.value = withSpring(1.1);
    },
    onUpdate: (event) => {
      'worklet';
      dragX.value = event.translationX;
      dragY.value = event.translationY;
      // Izquierda (negativo) => rota a la izquierda; derecha (positivo) => rota a la derecha
      rotation.value = interpolate(
        event.translationX,
        [-ROTATION_DISTANCE, 0, ROTATION_DISTANCE],
        [-MAX_ROTATION, 0, MAX_ROTATION],
        Extrapolation.CLAMP,
      );
    },
    onDeactivate: () => {
      'worklet';
      offsetX.value += dragX.value;
      offsetY.value += dragY.value;
      dragX.value = 0;
      dragY.value = 0;
    },
    onFinalize: () => {
      'worklet';
      lifted.value = withSpring(1);
      rotation.value = withSpring(0, { damping: 10, stiffness: 120 });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value + dragX.value },
      { translateY: offsetY.value + dragY.value },
      { rotate: `${rotation.value}deg` },
      { scale: lifted.value },
    ],
  }));

  const resetPosition = () => {
    offsetX.value = withSpring(0);
    offsetY.value = withSpring(0);
  };

  return (
    <ScreenContainer hint={strings.drag.hint}>
      <View style={styles.area}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.shape, animatedStyle]}>
            <Text style={styles.arrows}>⟵ ⟶</Text>
          </Animated.View>
        </GestureDetector>
      </View>
      <View style={styles.footer}>
        <AppButton label={strings.drag.reset} onPress={resetPosition} color={colors.surfaceAlt} />
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
  },
  shape: {
    width: SHAPE_SIZE,
    height: SHAPE_SIZE,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  arrows: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});
