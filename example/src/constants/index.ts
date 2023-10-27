import { Easing } from 'react-native-reanimated';

export const INPUT_FIELD_HEIGHT = 50;

export const TEXT_INPUT_STYLE = {
  borderColor: '#ddd',
  borderRadius: 10,
  borderWidth: 1,
  flexGrow: 1,
  height: INPUT_FIELD_HEIGHT,
  marginBottom: 10,
  padding: 10
};

export const EASING = {
  easeIn: Easing.in(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  easeInOutQuad: Easing.inOut(Easing.quad),
  easeInQuad: Easing.in(Easing.quad),
  easeOut: Easing.out(Easing.ease),
  easeOutQuad: Easing.out(Easing.quad),
  linear: Easing.linear
};
