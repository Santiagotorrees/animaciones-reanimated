import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { strings } from '../constants/strings';
import { colors, spacing } from '../constants/theme';
import BounceScreen from '../screens/BounceScreen';
import CarouselScreen from '../screens/CarouselScreen';
import DragRotateScreen from '../screens/DragRotateScreen';
import HomeScreen from '../screens/HomeScreen';
import LoadingScreen from '../screens/LoadingScreen';
import MultitouchScreen from '../screens/MultitouchScreen';
import ShakeScreen from '../screens/ShakeScreen';
import { RootDrawerParamList, RouteName, routes } from './routes';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const screens: Record<RouteName, React.ComponentType> = {
  Home: HomeScreen,
  DragRotate: DragRotateScreen,
  Loading: LoadingScreen,
  Multitouch: MultitouchScreen,
  Bounce: BounceScreen,
  Carousel: CarouselScreen,
  Shake: ShakeScreen,
};

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{strings.appName}</Text>
        <Text style={styles.headerSubtitle}>{strings.author}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          drawerStyle: { backgroundColor: colors.surface },
          drawerActiveTintColor: colors.text,
          drawerActiveBackgroundColor: colors.primary,
          drawerInactiveTintColor: colors.textMuted,
          drawerType: 'front',
          // Evita conflicto entre el gesto de abrir el menú y los gestos de cada ejercicio
          swipeEnabled: false,
        }}
      >
        {routes.map((route) => (
          <Drawer.Screen
            key={route.name}
            name={route.name}
            component={screens[route.name]}
            options={{
              title: route.title,
              drawerIcon: () => <Text style={styles.icon}>{route.icon}</Text>,
            }}
          />
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  icon: {
    fontSize: 18,
  },
});
