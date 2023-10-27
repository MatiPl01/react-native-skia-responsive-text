import { Easing } from 'react-native-reanimated';

export const INPUT_FIELD_HEIGHT = 50;

export const EASING = {
  easeIn: Easing.in(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  easeInOutQuad: Easing.inOut(Easing.quad),
  easeInQuad: Easing.in(Easing.quad),
  easeOut: Easing.out(Easing.ease),
  easeOutQuad: Easing.out(Easing.quad),
  linear: Easing.linear
};
