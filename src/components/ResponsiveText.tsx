import { Group, Rect, SkFont, TextProps } from '@shopify/react-native-skia';
import { memo, useMemo } from 'react';
import { runOnJS, SharedValue, useDerivedValue } from 'react-native-reanimated';

import { useAnimatableValue } from '../hooks';
import {
  AnimatableProps,
  AnimationSettings,
  EllipsizeMode,
  HorizontalAlignment,
  PartialBy,
  TextLineData,
  VerticalAlignment
} from '../types';
import {
  getTextChunks,
  getTextLinesAlignment,
  getVerticalAlignmentOffset,
  wrapText
} from '../utils';
import TextLine from './TextLine';

const LINE_HEIGHT_MULTIPLIER = 1.5;

type ResponsiveTextProps = PartialBy<TextProps, 'x' | 'y'> & {
  ellipsizeMode?: EllipsizeMode;
  height?: number;
  numberOfLines?: number;
  onMeasure?: (width: number, height: number) => void;
  width?: number;
} & AnimatableProps<{
    backgroundColor?: string;
    font: SkFont;
    horizontalAlignment?: HorizontalAlignment;
    lineHeight?: number;
    verticalAlignment?: VerticalAlignment;
  }> &
  (
    | { animationProgress?: SharedValue<number> }
    | { animationSettings?: AnimationSettings }
  );

function ResponsiveText({
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
  // Create shared values from animatable props
  const backgroundColor = useAnimatableValue(backgroundColorProp);

  const lineHeight = useAnimatableValue(
    lineHeightProp ?? LINE_HEIGHT_MULTIPLIER * fontSize
  );
  const horizontalAlignment = useAnimatableValue(horizontalAlignmentProp);
  const verticalAlignment = useAnimatableValue(verticalAlignmentProp);

  const textChunks = useMemo(() => getTextChunks(text), [text]);
  // Divide text into lines
  const textLines = useMemo<Array<TextLineData>>(
    () => wrapText(textChunks, font, width, numberOfLines, ellipsizeMode),
    [textChunks, font, width, numberOfLines, ellipsizeMode]
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
      textLines.length * lineHeight.value -
      (lineHeight.value - LINE_HEIGHT_MULTIPLIER * fontSize)
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

export default memo(ResponsiveText);
