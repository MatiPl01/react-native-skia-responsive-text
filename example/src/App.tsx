import { Canvas } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';
import { ResponsiveText } from 'react-native-skia-responsive-text';

export default function App() {
  return (
    <Canvas style={styles.fill}>
      <ResponsiveText>dasda</ResponsiveText>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  }
});
