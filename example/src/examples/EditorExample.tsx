import { Canvas, LinearGradient, Rect } from '@shopify/react-native-skia';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleEditor, TextPreview } from 'src/components';
import { StyleEditorProvider } from 'src/context';

export default function EditorExample() {
  const insets = useSafeAreaInsets();
  const { height, width } = Dimensions.get('screen');

  return (
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
        <ScrollView contentContainerStyle={{ paddingTop: insets.top }}>
          {/* Text preview */}
          <TextPreview />
          {/* Style editor */}
          <StyleEditor />
        </ScrollView>
      </View>
    </StyleEditorProvider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  }
});
