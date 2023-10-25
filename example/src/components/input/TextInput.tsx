import { useRef } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps
} from 'react-native';
import { INPUT_FIELD_HEIGHT } from 'src/constants';
import { useBlurOnDismiss } from 'src/hooks';

export default function TextInput(props: TextInputProps) {
  const inputRef = useRef<RNTextInput>(null);

  useBlurOnDismiss(inputRef);

  return <RNTextInput ref={inputRef} style={styles.input} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#ddd',
    borderRadius: 10,
    borderWidth: 1,
    flexGrow: 1,
    height: INPUT_FIELD_HEIGHT,
    marginBottom: 10,
    padding: 10
  }
});
