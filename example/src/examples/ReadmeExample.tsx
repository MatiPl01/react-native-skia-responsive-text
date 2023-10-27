/* eslint-disable import/no-unused-modules */
import {
  Canvas,
  LinearGradient,
  Rect,
  RoundedRect,
  Shadow,
  useFont
} from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import ResponsiveText, {
  HorizontalAlignment,
  VerticalAlignment
} from 'react-native-skia-responsive-text';

const ALIGNMENTS: Array<{
  horizontal: HorizontalAlignment;
  vertical: VerticalAlignment;
}> = [
  { horizontal: 'left', vertical: 'top' },
  { horizontal: 'center', vertical: 'top' },
  { horizontal: 'right', vertical: 'top' },
  { horizontal: 'left', vertical: 'center' },
  { horizontal: 'center', vertical: 'center' },
  { horizontal: 'right', vertical: 'center' },
  { horizontal: 'left', vertical: 'bottom' },
  { horizontal: 'center', vertical: 'bottom' },
  { horizontal: 'right', vertical: 'bottom' }
];

export default function ReadmeExample() {
  const fontSize = 18;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-var-requires
  const font = useFont(require('../../assets/Poppins-Regular.ttf'), fontSize);

  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const horizontalAlignment = useSharedValue<HorizontalAlignment>('left');
  const verticalAlignment = useSharedValue<VerticalAlignment>('top');

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      horizontalAlignment.value = ALIGNMENTS[i]!.horizontal;
      verticalAlignment.value = ALIGNMENTS[i]!.vertical;

      i = (i + 1) % ALIGNMENTS.length;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!font) {
    return (
      <SafeAreaView>
        <Text>There was a problem loading fonts</Text>
      </SafeAreaView>
    );
  }

  const fullHeight = dimensions.height + insets.top;
  const fullWidth = dimensions.width;

  const size = 0.75 * Math.min(fullHeight, fullWidth);
  const padding = 10;

  return (
    <Canvas style={styles.fill}>
      <Rect height={fullHeight} width={fullWidth}>
        <LinearGradient
          colors={['#40C9FF', '#E81CFF']}
          end={{ x: fullWidth, y: fullHeight }}
          positions={[0, 0.75]}
          start={{ x: 0, y: 0 }}
        />
      </Rect>
      <RoundedRect
        color='rgba(255, 255, 255, .15)'
        height={size + 2 * padding}
        r={25}
        width={size + 2 * padding}
        x={(fullWidth - size) / 2 - padding}
        y={(fullHeight - size) / 2 - padding}></RoundedRect>
      <ResponsiveText
        animationSettings={{ duration: 300 }}
        color='white'
        font={font}
        height={size}
        horizontalAlignment={horizontalAlignment}
        lineHeight={1.5 * fontSize}
        text='Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione dignissimos obcaecati, maiores odio modi suscipit adipisci officiis laudantium at doloremque.'
        verticalAlignment={verticalAlignment}
        width={size}
        x={(fullWidth - size) / 2}
        y={(fullHeight - size) / 2}>
        <Shadow blur={5} color='rgba(0,0, 0, .25)' dx={0} dy={5} />
      </ResponsiveText>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  }
});
