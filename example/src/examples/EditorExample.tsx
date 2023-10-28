import {
  Canvas,
  DataSourceParam,
  LinearGradient,
  Rect
} from '@shopify/react-native-skia';
import { FontSource, useFonts } from 'expo-font';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleEditor, TextPreview } from 'src/components';
import { StyleEditorProvider } from 'src/context';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-var-requires
const FONT = require('../../assets/Poppins-Regular.ttf') as FontSource &
  DataSourceParam;

export default function EditorExample() {
  const { height, width } = useWindowDimensions();

  const fontSize = 16;

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': FONT
  });

  const [canvasDimensions, setCanvasDimensions] = useState({
    height: 0,
    width: 0
  });

  if (!fontsLoaded) {
    return null;
  }

  if (fontError) {
    return (
      <SafeAreaView>
        <Text>There was a problem loading fonts</Text>
      </SafeAreaView>
    );
  }

  const previewHeight = 0.2 * height;
  const previewInnerPadding = 0.025 * width;

  return (
    <KeyboardAvoidingView style={styles.fill}>
      <StyleEditorProvider>
        <View style={styles.fill}>
          <Canvas style={StyleSheet.absoluteFill}>
            <Rect height={height} width={width}>
              <LinearGradient
                colors={['#40C9FF', '#E81CFF']}
                end={{ x: width, y: height }}
                positions={[0, 0.5]}
                start={{ x: 0, y: 0 }}
              />
            </Rect>
          </Canvas>
          {/* Text preview */}
          <TextPreview
            fontSize={fontSize}
            previewHeight={previewHeight}
            previewInnerPadding={previewInnerPadding}
            setCanvasDimensions={setCanvasDimensions}
          />
          {/* Style editor */}
          <StyleEditor
            canvasDimensions={canvasDimensions}
            previewInnerPadding={previewInnerPadding}
          />
        </View>
      </StyleEditorProvider>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  }
});
