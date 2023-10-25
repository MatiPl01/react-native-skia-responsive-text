import { EasingFunction } from 'react-native';
import { EasingFunctionFactory, SharedValue } from 'react-native-reanimated';

type AnimationEasing = EasingFunction | EasingFunctionFactory;

export type AnimationSettings = {
  duration?: number;
  easing?: AnimationEasing;
  onComplete?: (finished?: boolean) => void;
};

export type AnimatableValue<T> = T extends infer U | undefined
  ? U extends undefined
    ? never
    : SharedValue<U> | U
  : SharedValue<T> | T;

export type AnimatableProps<T extends object> = {
  [K in keyof T]: AnimatableValue<T[K]>;
};
