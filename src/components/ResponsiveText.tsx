import {
  Group,
  Mask,
  Rect,
  SkFont,
  TextProps
} from '@shopify/react-native-skia';
import { memo, useMemo } from 'react';
import { runOnJS, SharedValue, useDerivedValue } from 'react-native-reanimated';

import { useAnimatableValue } from '../hooks';
import {
  AnimatableProps,
  AnimationSettings,
  EllipsizeMode,
  HorizontalAlignment,
  TextLineData,
  TextOverflow,
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

type ResponsiveTextProps = Omit<TextProps, 'x' | 'y'> & {
  ellipsizeMode?: EllipsizeMode;
  font: SkFont;
  height?: number;
  numberOfLines?: number;
  onMeasure?: (width: number, height: number) => void;
  overflow?: TextOverflow;
  width?: number;
} & AnimatableProps<{
    backgroundColor?: string;
    horizontalAlignment?: HorizontalAlignment;
    lineHeight?: number;
    verticalAlignment?: VerticalAlignment;
    x?: number;
    y?: number;
  }> &
  (
    | { animationProgress?: SharedValue<number> }
    | { animationSettings?: AnimationSettings }
  );

type ResponsiveTextPrivateProps = ResponsiveTextProps & {
  animationProgress?: SharedValue<number>;
  animationSettings?: AnimationSettings;
};

function ResponsiveText({
  animationSettings: animationSettingsProp,
  backgroundColor: backgroundColorProp,
  children,
  ellipsizeMode,
  font,
  height: heightProp,
  horizontalAlignment: horizontalAlignmentProp = 'left',
  lineHeight: lineHeightProp,
  numberOfLines,
  onMeasure,
  overflow = 'visible',
  text = '',
  verticalAlignment: verticalAlignmentProp = 'top',
  width: widthProp,
  x: xProp = 0,
  y: yProp = 0,
  ...rest
}: ResponsiveTextPrivateProps) {
  const fontSize = font.getSize();
  const width = widthProp ?? font.getTextWidth(text);

  // Update animation settings if they are provided
  const animationSettings = useMemo(() => {
    if (!animationSettingsProp) return undefined;
    const { duration, easing, onComplete } = animationSettingsProp;
    if (!duration && !easing) return undefined;
    if (!duration) return { easing, onComplete };
    if (!easing) return { duration, onComplete };
    return { duration, easing, onComplete };
  }, [animationSettingsProp]);

  // Create shared values from animatable props
  const x = useAnimatableValue(xProp);
  const y = useAnimatableValue(yProp);
  const backgroundColor = useAnimatableValue(
    backgroundColorProp ?? 'transparent'
  );
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

  const backgroundHeight = useDerivedValue(
    () => heightProp ?? textHeight.value
  );

  const verticalAlignmentOffset = useDerivedValue(() =>
    getVerticalAlignmentOffset(
      textHeight.value,
      heightProp,
      verticalAlignment.value
    )
  );

  const backgroundComponent = backgroundColorProp && (
    <Rect
      color={backgroundColor}
      height={backgroundHeight}
      width={width}
      y={0}
    />
  );

  const textComponent = (
    <>
      {textLines.map((line, i) => (
        <TextLine
          {...rest}
          animationSettings={animationSettings}
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
    </>
  );

  const maskElement = useMemo(
    () => <Rect color='white' height={backgroundHeight} width={width} />,
    [backgroundHeight, width]
  );

  const groupTransform = useDerivedValue(() => [
    { translateX: x.value },
    { translateY: y.value }
  ]);

  return (
    <Group transform={groupTransform}>
      {overflow === 'hidden' ? (
        <>
          {backgroundComponent && (
            <Mask mask={maskElement} mode='luminance'>
              {backgroundComponent}
            </Mask>
          )}
          <Mask mask={maskElement} mode='luminance'>
            {textComponent}
          </Mask>
        </>
      ) : (
        <>
          {backgroundComponent}
          {textComponent}
        </>
      )}
    </Group>
  );
}

export default memo(ResponsiveText) as (
  props: ResponsiveTextProps
) => JSX.Element;
