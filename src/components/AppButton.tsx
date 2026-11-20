import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  color?: string;
};

export default function AppButton({ label, onPress, color = colors.primary }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: color, opacity: pressed ? 0.75 : 1 }]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.round,
    marginHorizontal: spacing.xs,
  },
  label: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
});
