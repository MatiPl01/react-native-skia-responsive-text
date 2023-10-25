import { SharedValue, useDerivedValue } from 'react-native-reanimated';

import { AnimatableValue } from '../types';
import { isSharedValue } from '../utils';

export default function useAnimatableValue<T>(
  value: AnimatableValue<T>
): SharedValue<T> {
  return useDerivedValue<T>(
    () => (isSharedValue<T>(value) ? value.value : (value as T)),
    [value]
  );
}
