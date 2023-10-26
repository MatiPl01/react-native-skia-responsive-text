import {
  Canvas,
  DataSourceParam,
  SkFont,
  useFont
} from '@shopify/react-native-skia';
import { FontSource, useFonts } from 'expo-font';
import { PropsWithChildren, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const { lineHeight, text } = useStyleEditorContext();

  const previewHeight = 0.25 * dimensions.height;
  const previewInnerPadding = 0.025 * dimensions.width;

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
              lineHeight
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
            height={canvasDimensions.height - 2 * previewInnerPadding}
            lineHeight={lineHeight}
            text={text}
            width={canvasDimensions.width - 2 * previewInnerPadding}
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
