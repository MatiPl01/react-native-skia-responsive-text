import { Canvas, SkFont } from '@shopify/react-native-skia';
import { PropsWithChildren } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ResponsiveText } from 'react-native-skia-responsive-text';
import { EASING } from 'src/constants';
import { useStyleEditorContext } from 'src/context';

type PreviewContainerProps = PropsWithChildren<{
  heading: string;
  height: number;
}>;

function PreviewContainer({
  children,
  heading,
  height
}: PreviewContainerProps) {
  const dimensions = useWindowDimensions();
  const previewOuterPadding = 0.05 * dimensions.width;

  return (
    <View
      style={{
        height,
        padding: previewOuterPadding,
        paddingBottom: 0,
        width: dimensions.width
      }}>
      <Text style={styles.heading}>{heading}</Text>
      {children}
    </View>
  );
}

type TextPreviewProps = {
  font: SkFont;
  fontSize: number;
  previewHeight: number;
  previewInnerPadding: number;
  setCanvasDimensions: (canvasDimensions: {
    height: number;
    width: number;
  }) => void;
};

export default function TextPreview({
  font,
  fontSize,
  previewHeight,
  previewInnerPadding,
  setCanvasDimensions
}: TextPreviewProps) {
  const {
    animationDuration,
    animationEasing,
    animationProgress,
    backgroundColor,
    color,
    ellipsizeMode,
    height,
    horizontalAlignment,
    lineHeight,
    numberOfLines,
    text,
    verticalAlignment,
    width
  } = useStyleEditorContext();

  return (
    <>
      {/* React Native Text preview */}
      <PreviewContainer heading='React Native Text' height={previewHeight}>
        <View
          style={[styles.previewContainer, { padding: previewInnerPadding }]}>
          <Text
            ellipsizeMode={ellipsizeMode}
            numberOfLines={numberOfLines}
            style={[
              styles.previewText,
              {
                backgroundColor,
                color,
                fontSize,
                height,
                lineHeight,
                textAlign:
                  horizontalAlignment === 'center-left' ||
                  horizontalAlignment === 'center-right'
                    ? 'center'
                    : horizontalAlignment,
                verticalAlign:
                  verticalAlignment === 'center' ? 'middle' : verticalAlignment,
                width
              }
            ]}>
            {text}
          </Text>
        </View>
      </PreviewContainer>

      {/* ResponsiveText preview */}
      <PreviewContainer heading='Skia ResponsiveText' height={previewHeight}>
        <Canvas
          style={styles.previewContainer}
          onLayout={({ nativeEvent: { layout } }) => {
            setCanvasDimensions({ height: layout.height, width: layout.width });
          }}>
          <ResponsiveText
            animationProgress={animationProgress}
            backgroundColor={backgroundColor}
            color={color}
            ellipsizeMode={ellipsizeMode}
            font={font}
            height={height}
            horizontalAlignment={horizontalAlignment}
            lineHeight={lineHeight}
            numberOfLines={numberOfLines}
            text={text}
            verticalAlignment={verticalAlignment}
            width={width}
            x={previewInnerPadding}
            y={previewInnerPadding}
            animationSettings={
              animationDuration || animationEasing
                ? {
                    duration: animationDuration,
                    easing: animationEasing && EASING[animationEasing]
                  }
                : undefined
            }
          />
        </Canvas>
      </PreviewContainer>
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { height: 2, width: 0 },
    textShadowRadius: 5
  },
  previewContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    flex: 1
  },
  previewText: {
    fontFamily: 'Poppins-Regular'
  }
});
