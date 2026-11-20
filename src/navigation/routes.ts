import { strings } from '../constants/strings';

export type RootDrawerParamList = {
  Home: undefined;
  DragRotate: undefined;
  Loading: undefined;
  Multitouch: undefined;
  Bounce: undefined;
  Carousel: undefined;
  Shake: undefined;
};

export type RouteName = keyof RootDrawerParamList;

export type RouteInfo = {
  name: RouteName;
  title: string;
  icon: string;
};

export const routes: RouteInfo[] = [
  { name: 'Home', title: strings.home.title, icon: '🏠' },
  { name: 'DragRotate', title: strings.drag.title, icon: '✋' },
  { name: 'Loading', title: strings.loading.title, icon: '⏳' },
  { name: 'Multitouch', title: strings.multitouch.title, icon: '🤏' },
  { name: 'Bounce', title: strings.bounce.title, icon: '🏀' },
  { name: 'Carousel', title: strings.carousel.title, icon: '🎠' },
  { name: 'Shake', title: strings.shake.title, icon: '📳' },
];
