import { Canvas, useFont } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';
import ResponsiveText from 'react-native-skia-responsive-text';

export default function UsageExample() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-var-requires
  const font = useFont(require('../../assets/Poppins-Regular.ttf'), 16);

  if (!font) {
    return null;
  }

  return (
    <Canvas style={styles.fill}>
      <ResponsiveText font={font} text='Hello World!' width={50} />
    </Canvas>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  }
});
