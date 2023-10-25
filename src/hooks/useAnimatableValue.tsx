import {
  isSharedValue,
  SharedValue,
  useDerivedValue
} from 'react-native-reanimated';

import { AnimatableValue } from '@/types';

export default function useAnimatableValue<T>(
  value: AnimatableValue<T>
): SharedValue<T> {
  return useDerivedValue(
    () => (isSharedValue<T>(value) ? value.value : (value as T)),
    [value]
  );
}
