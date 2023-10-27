import { Text, TextProps } from '@shopify/react-native-skia';
import {
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import { AnimationSettings } from '../types';

type TextLineProps = Omit<TextProps, 'x' | 'y'> & {
  animationProgress?: SharedValue<number>;
  animationSettings?: AnimationSettings;
  fontSize: number;
  horizontalAlignmentOffsets: SharedValue<Array<number>>;
  index: number;
  lineHeight: SharedValue<number>;
  verticalAlignmentOffset: SharedValue<number>;
};

export default function TextLine({
  animationProgress,
  animationSettings,
  fontSize,
  horizontalAlignmentOffsets,
  index,
  lineHeight,
  verticalAlignmentOffset,
  ...rest
}: TextLineProps) {
  const getCurrentX = () => {
    'worklet';
    return horizontalAlignmentOffsets.value[index] ?? 0;
  };
  const getCurrentY = () => {
    'worklet';
    return verticalAlignmentOffset.value + index * lineHeight.value + fontSize;
  };

  const startX = useSharedValue(getCurrentX());
  const startY = useSharedValue(getCurrentY());
  const prevTargetX = useSharedValue(getCurrentX());
  const prevTargetY = useSharedValue(getCurrentY());
  const x = useSharedValue(getCurrentX());
  const y = useSharedValue(getCurrentY());

  useAnimatedReaction(
    () => ({
      x: horizontalAlignmentOffsets.value[index] ?? 0,
      y: verticalAlignmentOffset.value + index * lineHeight.value + fontSize
    }),
    target => {
      if (animationSettings) {
        const { onComplete, ...animation } = animationSettings;
        x.value = withTiming(target.x, animation, onComplete);
        y.value = withTiming(target.y, animation, onComplete);
      } else if (!animationProgress) {
        x.value = target.x;
        y.value = target.y;
      }
    },
    [animationProgress, animationSettings, index, fontSize]
  );

  useAnimatedReaction(
    () => animationProgress?.value ?? null,
    progress => {
      if (progress === null) return;

      const targetX = getCurrentX();
      const targetY = getCurrentY();

      if (targetX !== prevTargetX.value || targetY !== prevTargetY.value) {
        startX.value = x.value;
        startY.value = y.value;
        prevTargetX.value = targetX;
        prevTargetY.value = targetY;
      }

      x.value = interpolate(progress, [0, 1], [startX.value, targetX]);
      y.value = interpolate(progress, [0, 1], [startY.value, targetY]);
    },
    [animationProgress]
  );

  return <Text {...rest} x={x} y={y} />;
}
