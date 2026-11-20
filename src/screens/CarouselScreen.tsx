import React, { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  scrollTo,
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';
import AppButton from '../components/AppButton';
import ScreenContainer from '../components/ScreenContainer';
import { strings } from '../constants/strings';
import { cardPalette, colors, radius, spacing } from '../constants/theme';

type CarouselItem = (typeof strings.carousel.items)[number];

type CardProps = {
  item: CarouselItem;
  index: number;
  scrollX: SharedValue<number>;
  cardWidth: number;
  itemSize: number;
};

function Card({ item, index, scrollX, cardWidth, itemSize }: CardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * itemSize, index * itemSize, (index + 1) * itemSize];

    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolation.CLAMP);
    const rotateZ = interpolate(scrollX.value, inputRange, [8, 0, -8], Extrapolation.CLAMP);
    const rotateY = interpolate(scrollX.value, inputRange, [18, 0, -18], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [30, 0, 30], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [
        { perspective: 900 },
        { translateY },
        { scale },
        { rotateY: `${rotateY}deg` },
        { rotateZ: `${rotateZ}deg` },
      ],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * itemSize, index * itemSize, (index + 1) * itemSize];
    const translateX = interpolate(scrollX.value, inputRange, [60, 0, -60], Extrapolation.CLAMP);
    return { transform: [{ translateX }] };
  });

  return (
    <Animated.View
      style={[
        styles.card,
        { width: cardWidth, backgroundColor: cardPalette[index % cardPalette.length] },
        animatedStyle,
      ]}
    >
      <Animated.Text style={[styles.icon, iconStyle]}>{item.icon}</Animated.Text>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      <Text style={styles.cardIndex}>
        {index + 1} / {strings.carousel.items.length}
      </Text>
    </Animated.View>
  );
}

function Dot({ index, scrollX, itemSize }: { index: number; scrollX: SharedValue<number>; itemSize: number }) {
  const style = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * itemSize, index * itemSize, (index + 1) * itemSize];
    return {
      width: interpolate(scrollX.value, inputRange, [8, 26, 8], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], Extrapolation.CLAMP),
    };
  });
  return <Animated.View style={[styles.dot, style]} />;
}

export default function CarouselScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.7;
  const gap = spacing.md;
  const itemSize = cardWidth + gap;
  const sidePadding = (width - cardWidth) / 2;
  const items = strings.carousel.items;

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);
  const [current, setCurrent] = useState(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  useAnimatedReaction(
    () => Math.round(scrollX.value / itemSize),
    (index, previous) => {
      if (index !== previous) {
        scheduleOnRN(setCurrent, index);
      }
    },
  );

  const goTo = (index: number) => {
    const target = Math.max(0, Math.min(items.length - 1, index));
    scheduleOnUI(() => {
      'worklet';
      scrollTo(scrollRef, target * itemSize, 0, true);
    });
  };

  return (
    <ScreenContainer hint={strings.carousel.hint} contentStyle={styles.content}>
      <Animated.ScrollView
        ref={scrollRef}
        style={styles.scroll}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemSize}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={{ paddingHorizontal: sidePadding, alignItems: 'center' }}
      >
        {items.map((item, index) => (
          <View key={item.title} style={{ marginRight: index === items.length - 1 ? 0 : gap }}>
            <Card item={item} index={index} scrollX={scrollX} cardWidth={cardWidth} itemSize={itemSize} />
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.dots}>
        {items.map((item, index) => (
          <Dot key={item.title} index={index} scrollX={scrollX} itemSize={itemSize} />
        ))}
      </View>

      <View style={styles.buttons}>
        <AppButton label={strings.carousel.previous} onPress={() => goTo(current - 1)} color={colors.surfaceAlt} />
        <AppButton label={strings.carousel.next} onPress={() => goTo(current + 1)} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  scroll: {
    alignSelf: 'stretch',
    flexGrow: 0,
  },
  card: {
    height: 340,
    borderRadius: radius.lg,
    padding: spacing.lg,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  icon: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    fontSize: 72,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: colors.text,
    opacity: 0.85,
    fontSize: 16,
    marginTop: spacing.xs,
  },
  cardIndex: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    color: colors.text,
    fontWeight: '700',
  },
  dots: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  dot: {
    height: 8,
    borderRadius: radius.round,
    backgroundColor: colors.text,
    marginHorizontal: 4,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
