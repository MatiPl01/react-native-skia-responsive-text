import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { HorizontalAlignment } from 'react-native-skia-responsive-text';
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

export default function StyleEditor() {
  const {
    horizontalAlignment,
    lineHeight,
    setHorizontalAlignment,
    setLineHeight,
    setText,
    text
  } = useStyleEditorContext();

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
              max={30}
              min={10}
              placeholder='Line Height'
              value={lineHeight}
              onChange={setLineHeight}
            />
          </View>
        </View>
        <View>
          <Text style={styles.sectionLabel}>Alignment</Text>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>horizontal</Text>
            <SelectInput
              options={horizontalAlignmentOptions}
              value={horizontalAlignment}
              onChange={setHorizontalAlignment}
            />
          </View>
          <View style={styles.section}>
            {/* <Text style={styles.sectionLabel}>vertical</Text>
          <SelectInput  /> */}
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
    marginTop: 20
  },
  section: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 5
  },
  sectionInput: {
    flexBasis: '66%'
  },
  sectionLabel: {
    color: '#666',
    flexBasis: '33%',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  }
});
