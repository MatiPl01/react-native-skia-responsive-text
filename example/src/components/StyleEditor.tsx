import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
// eslint-disable-next-line import/default
import Animated, { FadeIn, useSharedValue } from 'react-native-reanimated';
import {
  EllipsizeMode,
  HorizontalAlignment,
  VerticalAlignment
} from 'react-native-skia-responsive-text';
import { EASING } from 'src/constants';
import { useStyleEditorContext } from 'src/context';
import { AnimationType } from 'src/types';

import {
  ColorSelector,
  NumberInput,
  SelectInput,
  SliderInput,
  TextInput
} from './input';

const horizontalAlignmentOptions: Array<{
  label: HorizontalAlignment;
  value: HorizontalAlignment;
}> = [
  { label: 'left', value: 'left' },
  { label: 'center', value: 'center' },
  { label: 'right', value: 'right' },
  { label: 'center-left', value: 'center-left' },
  { label: 'center-right', value: 'center-right' }
];

const verticalAlignmentOptions: Array<{
  label: VerticalAlignment;
  value: VerticalAlignment;
}> = [
  { label: 'top', value: 'top' },
  { label: 'center', value: 'center' },
  { label: 'bottom', value: 'bottom' }
];

const ellipsizeModeOptions: Array<{
  label: EllipsizeMode;
  value: EllipsizeMode;
}> = [
  { label: 'head', value: 'head' },
  { label: 'middle', value: 'middle' },
  { label: 'tail', value: 'tail' },
  { label: 'clip', value: 'clip' }
];

const animationTypeOptions: Array<{
  label: string;
  value: AnimationType;
}> = [
  { label: 'none', value: 'none' },
  { label: 'Progress-based', value: 'progress' },
  { label: 'Timing-based', value: 'timing' }
];

const easingOptions: Array<{
  label: keyof typeof EASING;
  value: keyof typeof EASING;
}> = Object.keys(EASING).map(key => ({
  label: key as keyof typeof EASING,
  value: key as keyof typeof EASING
}));

type StyleEditorProps = {
  canvasDimensions: { height: number; width: number };
  previewInnerPadding: number;
};

export default function StyleEditor({
  canvasDimensions,
  previewInnerPadding
}: StyleEditorProps) {
  const [animationType, setAnimationType] = useState<AnimationType>('none');
  const animationProgress = useSharedValue(0);

  const {
    animationDuration,
    animationEasing,
    backgroundColor,
    color,
    ellipsizeMode,
    height,
    horizontalAlignment,
    lineHeight,
    numberOfLines,
    setAnimationDuration,
    setAnimationEasing,
    setAnimationProgress,
    setBackgroundColor,
    setColor,
    setEllipsizeMode,
    setHeight,
    setHorizontalAlignment,
    setLineHeight,
    setNumberOfLines,
    setText,
    setVerticalAlignment,
    setWidth,
    text,
    verticalAlignment,
    width
  } = useStyleEditorContext();

  const maxWidth = +(
    canvasDimensions.width -
    2 * previewInnerPadding
  ).toFixed();
  const maxHeight = +(
    canvasDimensions.height -
    2 * previewInnerPadding
  ).toFixed();

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Text</Text>
          <View style={styles.sectionInput}>
            <TextInput
              placeholder='Type in text'
              value={text}
              onChangeText={setText}
              onClear={() => setText('')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>lineHeight</Text>
          <View style={styles.sectionInput}>
            <NumberInput
              longPressStep={2}
              max={30}
              min={10}
              placeholder='Line height'
              value={lineHeight}
              onChange={setLineHeight}
            />
          </View>
        </View>

        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>Dimensions</Text>
          <View style={styles.subSection}>
            <Text style={styles.subSectionLabel}>width</Text>
            <View style={styles.sectionInput}>
              <NumberInput
                longPressStep={5}
                max={maxWidth}
                min={0}
                placeholder='Width'
                value={width}
                onChange={setWidth}
              />
            </View>
          </View>
          <View style={styles.subSection}>
            <Text style={styles.subSectionLabel}>height</Text>
            <View style={styles.sectionInput}>
              <NumberInput
                longPressStep={5}
                max={maxHeight}
                min={0}
                placeholder='Height'
                value={height}
                onChange={setHeight}
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>Text overflow</Text>
          <View style={styles.subSection}>
            <Text style={styles.subSectionLabel}>numberOfLines</Text>
            <View style={styles.sectionInput}>
              <NumberInput
                max={5}
                min={1}
                placeholder='Number of lines'
                value={numberOfLines}
                onChange={setNumberOfLines}
              />
            </View>
          </View>
          <View style={styles.subSection}>
            <Text style={styles.subSectionLabel}>ellipsizeMode</Text>
            <View style={styles.sectionInput}>
              <SelectInput
                items={ellipsizeModeOptions}
                placeholder='Ellipsize mode'
                value={ellipsizeMode}
                onChange={setEllipsizeMode}
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>Alignment</Text>
          <View style={styles.subSection}>
            <Text style={styles.subSectionLabel}>horizontal</Text>
            <View style={styles.sectionInput}>
              <SelectInput
                items={horizontalAlignmentOptions}
                placeholder='Horizontal alignment'
                value={horizontalAlignment}
                onChange={setHorizontalAlignment}
              />
            </View>
          </View>
          <View style={styles.subSection}>
            <Text style={styles.subSectionLabel}>vertical</Text>
            <View style={styles.sectionInput}>
              <SelectInput
                items={verticalAlignmentOptions}
                placeholder='Vertical alignment'
                value={verticalAlignment}
                onChange={setVerticalAlignment}
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>Alignment change animation</Text>
          <View style={styles.subSection}>
            <Text style={styles.sectionLabel}>Animation type</Text>
            <View style={styles.sectionInput}>
              <SelectInput
                items={animationTypeOptions}
                placeholder='Animation type'
                value={animationType}
                onChange={value => {
                  if (value !== 'timing') {
                    setAnimationDuration(undefined);
                    setAnimationEasing(undefined);
                  }
                  setAnimationProgress(
                    value === 'progress' ? animationProgress : undefined
                  );
                  setAnimationType(value);
                }}
              />
            </View>
          </View>

          {animationType === 'timing' && (
            <Animated.View entering={FadeIn} style={styles.sectionGroup}>
              <View style={styles.subSection}>
                <Text style={styles.subSectionLabel}>duration</Text>
                <View style={styles.sectionInput}>
                  <NumberInput
                    max={1000}
                    min={100}
                    placeholder='Duration (ms)'
                    step={50}
                    value={animationDuration}
                    onChange={setAnimationDuration}
                  />
                </View>
              </View>
              <View style={styles.subSection}>
                <Text style={styles.subSectionLabel}>easing</Text>
                <View style={styles.sectionInput}>
                  <SelectInput
                    items={easingOptions}
                    placeholder='Easing'
                    value={animationEasing}
                    onChange={setAnimationEasing}
                  />
                </View>
              </View>
            </Animated.View>
          )}

          {animationType === 'progress' && (
            <Animated.View entering={FadeIn} style={styles.sectionGroup}>
              <View style={styles.subSection}>
                <Text style={styles.subSectionLabel}>progress</Text>
                <View style={styles.sectionInput}>
                  <SliderInput progress={animationProgress} />
                </View>
              </View>
            </Animated.View>
          )}
        </View>

        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>Colors</Text>
          <View style={styles.subSection}>
            <Text style={styles.subSectionLabel}>text</Text>
            <View style={styles.sectionInput}>
              <ColorSelector
                label='Text color'
                value={color}
                onChange={setColor}
              />
            </View>
          </View>
          <View style={styles.subSection}>
            <Text style={styles.subSectionLabel}>background</Text>
            <View style={styles.sectionInput}>
              <ColorSelector
                label='Background color'
                value={backgroundColor}
                onChange={setBackgroundColor}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('screen').height / 2 - 20,
    padding: 20
  },
  scrollView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    marginTop: 20
  },
  section: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15
  },
  sectionGroup: {
    gap: 10,
    marginBottom: 15
  },
  sectionInput: {
    flexBasis: '66%'
  },
  sectionLabel: {
    color: '#666',
    flexBasis: '33%',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontWeight: 'bold'
  },
  subSection: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  },
  subSectionLabel: {
    color: '#777',
    flexBasis: '33%',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    fontWeight: 'bold'
  }
});
