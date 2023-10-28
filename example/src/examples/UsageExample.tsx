import { Canvas } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';
import ResponsiveText from 'react-native-skia-responsive-text';

export default function UsageExample() {
  return (
    <Canvas style={styles.fill}>
      <ResponsiveText text='Hello World!' width={50} />
    </Canvas>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  }
});
