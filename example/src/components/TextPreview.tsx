import { Canvas, SkFont } from '@shopify/react-native-skia';
import { PropsWithChildren, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ResponsiveText } from 'react-native-skia-responsive-text';
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
};

export default function TextPreview({ font, fontSize }: TextPreviewProps) {
  const dimensions = useWindowDimensions();
  const [canvasDimensions, setCanvasDimensions] = useState({
    height: 0,
    width: 0
  });

  const { horizontalAlignment, lineHeight, text, verticalAlignment } =
    useStyleEditorContext();

  const previewHeight = 0.25 * dimensions.height;
  const previewInnerPadding = 0.025 * dimensions.width;

  const textWidth = canvasDimensions.width - 2 * previewInnerPadding;
  const textHeight = canvasDimensions.height - 2 * previewInnerPadding;

  return (
    <>
      {/* React Native Text preview */}
      <PreviewContainer heading='React Native Text' height={previewHeight}>
        <View
          style={[styles.previewContainer, { padding: previewInnerPadding }]}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Poppins-Regular',
              fontSize,
              height: textHeight,
              lineHeight,
              textAlign:
                horizontalAlignment === 'center-left' ||
                horizontalAlignment === 'center-right'
                  ? 'center'
                  : horizontalAlignment,
              verticalAlign:
                verticalAlignment === 'center' ? 'middle' : verticalAlignment,
              width: textWidth
            }}>
            {text}
          </Text>
        </View>
      </PreviewContainer>

      {/* ResponsiveText preview */}
      <PreviewContainer heading='React Native Text' height={previewHeight}>
        <Canvas
          style={styles.previewContainer}
          onLayout={({
            nativeEvent: {
              layout: { height, width }
            }
          }) => {
            setCanvasDimensions({ height, width });
          }}>
          <ResponsiveText
            color='white'
            font={font}
            height={textHeight}
            horizontalAlignment={horizontalAlignment}
            lineHeight={lineHeight}
            text={text}
            verticalAlignment={verticalAlignment}
            width={textWidth}
            x={previewInnerPadding}
            y={previewInnerPadding}
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
  }
});
