import { SharedValue } from 'react-native-reanimated';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSharedValue<T>(value: any): value is SharedValue<T> {
  'worklet';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-underscore-dangle
  return value?._isReanimatedSharedValue === true;
}
