import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

type Props = {
  hint: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
};

export default function ScreenContainer({ hint, children, contentStyle }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hintBox}>
        <Text style={styles.hint}>{hint}</Text>
      </View>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hintBox: {
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
