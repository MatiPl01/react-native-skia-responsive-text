import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  HorizontalAlignment,
  VerticalAlignment
} from 'react-native-skia-responsive-text';
import { useStyleEditorContext } from 'src/context';

import { NumberInput, SelectInput, TextInput } from './input';

const horizontalAlignmentOptions: Array<{
  label: HorizontalAlignment;
  value: HorizontalAlignment;
}> = [
  { label: 'left', value: 'left' },
  { label: 'center', value: 'center' },
  { label: 'right', value: 'right' },
  // { label: 'justify', value: 'justify' } // TODO - implement
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

type StyleEditorProps = {
  canvasDimensions: { height: number; width: number };
  previewInnerPadding: number;
};

export default function StyleEditor({
  canvasDimensions,
  previewInnerPadding
}: StyleEditorProps) {
  const {
    height,
    horizontalAlignment,
    lineHeight,
    setHeight,
    setHorizontalAlignment,
    setLineHeight,
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
              placeholder='Line Height'
              value={lineHeight}
              onChange={setLineHeight}
            />
          </View>
        </View>

        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>Alignment</Text>
          <View style={styles.subSection}>
            <Text style={styles.subSectionLabel}>horizontal</Text>
            <SelectInput
              items={horizontalAlignmentOptions}
              placeholder='Horizontal Alignment'
              value={horizontalAlignment}
              onChange={setHorizontalAlignment}
            />
          </View>
          <View style={styles.subSection}>
            <Text style={styles.subSectionLabel}>vertical</Text>
            <SelectInput
              items={verticalAlignmentOptions}
              placeholder='Vertical Alignment'
              value={verticalAlignment}
              onChange={setVerticalAlignment}
            />
          </View>
        </View>

        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>Dimensions</Text>
          <View style={styles.subSection}>
            <Text style={styles.subSectionLabel}>width</Text>
            <NumberInput
              longPressStep={5}
              max={maxWidth}
              min={0}
              placeholder='Width'
              value={width}
              onChange={setWidth}
            />
          </View>
          <View style={styles.subSection}>
            <Text style={styles.subSectionLabel}>height</Text>
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
