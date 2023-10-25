import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useStyleEditorContext } from 'src/context';

import { NumberInput, TextInput } from './input';

export default function StyleEditor() {
  const { lineHeight, setLineHeight, setText, text } = useStyleEditorContext();

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Text</Text>
        <View style={styles.sectionInput}>
          <TextInput
            placeholder='Type in text'
            value={text}
            onChangeText={setText}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
    minHeight: Dimensions.get('screen').height / 2 - 20,
    padding: 20
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
