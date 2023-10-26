import {
  Canvas,
  DataSourceParam,
  LinearGradient,
  Rect,
  useFont
} from '@shopify/react-native-skia';
import { FontSource, useFonts } from 'expo-font';
import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleEditor, TextPreview } from 'src/components';
import { StyleEditorProvider } from 'src/context';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-var-requires
const FONT = require('../../assets/Poppins-Regular.ttf') as FontSource &
  DataSourceParam;

export default function EditorExample() {
  const { height, width } = Dimensions.get('screen');

  const fontSize = 16;

  const font = useFont(FONT, fontSize);
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': FONT
  });

  if (!fontsLoaded) {
    return null;
  }

  if (!font || fontError) {
    return (
      <SafeAreaView>
        <Text>There was a problem loading fonts</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.fill}>
      <StyleEditorProvider>
        <View style={styles.fill}>
          <Canvas style={StyleSheet.absoluteFill}>
            <Rect height={height} width={width}>
              <LinearGradient
                colors={['#16546c', '#5d0967']}
                end={{ x: width, y: height }}
                positions={[0, 0.75]}
                start={{ x: 0, y: 0 }}
              />
            </Rect>
          </Canvas>
          <SafeAreaView>
            {/* Text preview */}
            <TextPreview font={font} fontSize={fontSize} />
            {/* Style editor */}
            <StyleEditor />
          </SafeAreaView>
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
