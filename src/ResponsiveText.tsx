import {
  Group,
  Rect,
  SkFont,
  Text,
  TextProps
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import {
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import { useSharedifyableValue } from '@/hooks';
import { EllipsizeMode, TextLineData } from '@/types/components';
import { TextHorizontalAlignment, VerticalAlignment } from '@/types/layout';
import { AnimationSettings } from '@/types/settings';
import { PartialBy, Sharedifyable } from '@/types/utils';
import {
  getTextLinesAlignment,
  getVerticalAlignmentOffset,
  wrapText
} from '@/utils/text';

type ResponsiveTextProps = PartialBy<Omit<TextProps, 'font'>, 'x' | 'y'> & {
  backgroundColor?: Sharedifyable<string>;
  ellipsizeMode?: EllipsizeMode;
  font: SkFont;
  height?: number;
  horizontalAlignment?: Sharedifyable<TextHorizontalAlignment>;
  lineHeight?: Sharedifyable<number>;
  numberOfLines?: number;
  onMeasure?: (width: number, height: number) => void;
  verticalAlignment?: Sharedifyable<VerticalAlignment>;
  width?: number;
} & (
    | { animationProgress?: SharedValue<number> }
    | { animationSettings?: AnimationSettings }
  );

export default function ResponsiveText({
  backgroundColor: backgroundColorProp = 'transparent',
  children,
  ellipsizeMode,
  font,
  height = 0,
  horizontalAlignment: horizontalAlignmentProp = 'left',
  lineHeight: lineHeightProp,
  numberOfLines,
  onMeasure,
  text = '',
  verticalAlignment: verticalAlignmentProp = 'top',
  width = 0,
  x = 0,
  y = 0,
  ...rest
}: ResponsiveTextProps) {
  const fontSize = font.getSize();
  // Create shared values from sharedifyable props
  const backgroundColor = useSharedifyableValue(backgroundColorProp);

  const lineHeight = useSharedifyableValue(lineHeightProp ?? fontSize);
  const horizontalAlignment = useSharedifyableValue(horizontalAlignmentProp);
  const verticalAlignment = useSharedifyableValue(verticalAlignmentProp);

  // Divide text into lines
  const textLines = useMemo<Array<TextLineData>>(
    () => wrapText(text, font, width, numberOfLines, ellipsizeMode),
    [text, font, width, numberOfLines, ellipsizeMode]
  );

  // Calculate remaining values
  const horizontalAlignmentOffsets = useDerivedValue(() => {
    const alignments = getTextLinesAlignment(
      textLines,
      width,
      horizontalAlignment.value
    );

    const textWidth = textLines.reduce(
      (acc, { width: w }) => Math.max(acc, w),
      0
    );
    const textHeight = textLines.length * lineHeight.value;

    if (onMeasure) {
      runOnJS(onMeasure)(textWidth, textHeight);
    }

    return alignments;
  }, [textLines]);
  const textHeight = useDerivedValue(
    () =>
      textLines.length * lineHeight.value - (lineHeight.value - 1.5 * fontSize)
  );
  const backgroundHeight = useDerivedValue(() =>
    Math.max(textHeight.value, height)
  );
  const verticalAlignmentOffset = useDerivedValue(() =>
    getVerticalAlignmentOffset(
      textHeight.value,
      height,
      verticalAlignment.value
    )
  );

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      {backgroundColor && (
        <Rect
          color={backgroundColor}
          height={backgroundHeight}
          width={width}
          y={0}
        />
      )}
      {textLines.map((line, i) => (
        <TextLine
          {...rest}
          font={font}
          fontSize={fontSize}
          horizontalAlignmentOffsets={horizontalAlignmentOffsets}
          index={i}
          key={i}
          lineHeight={lineHeight}
          text={line.text}
          verticalAlignmentOffset={verticalAlignmentOffset}>
          {children}
        </TextLine>
      ))}
    </Group>
  );
}

type TextLineProps = Omit<TextProps, 'x' | 'y'> & {
  animationProgress?: SharedValue<number>;
  animationSettings?: AnimationSettings;
  fontSize: number;
  horizontalAlignmentOffsets: SharedValue<Array<number>>;
  index: number;
  lineHeight: SharedValue<number>;
  verticalAlignmentOffset: SharedValue<number>;
};

function TextLine({
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
    }
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
    }
  );

  return <Text {...rest} x={x} y={y} />;
}
