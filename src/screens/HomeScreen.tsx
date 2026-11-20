import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { strings } from '../constants/strings';
import { cardPalette, colors, radius, spacing } from '../constants/theme';
import { RootDrawerParamList, routes } from '../navigation/routes';

const exercises = routes.filter((r) => r.name !== 'Home');

export default function HomeScreen() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{strings.home.heading}</Text>
      <Text style={styles.description}>{strings.home.description}</Text>

      {exercises.map((route, index) => (
        <Animated.View key={route.name} entering={FadeInDown.delay(index * 80).springify()}>
          <Pressable
            onPress={() => navigation.navigate(route.name)}
            style={({ pressed }) => [styles.item, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={[styles.badge, { backgroundColor: cardPalette[index % cardPalette.length] }]}>
              <Text style={styles.badgeIcon}>{route.icon}</Text>
            </View>
            <Text style={styles.itemText}>{route.title}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </Animated.View>
      ))}

      <Text style={styles.author}>{strings.author}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  heading: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: radius.sm + 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  badgeIcon: {
    fontSize: 20,
  },
  itemText: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 26,
  },
  author: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontSize: 13,
  },
});
