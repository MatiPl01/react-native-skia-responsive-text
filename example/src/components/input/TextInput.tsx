import { MaterialIcons } from '@expo/vector-icons';
import { useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
  View
} from 'react-native';
import { INPUT_FIELD_HEIGHT } from 'src/constants';
import { useBlurOnDismiss } from 'src/hooks';

type TextInputProps = RNTextInputProps & {
  onClear?: () => void;
};

export default function TextInput({ onClear, ...rest }: TextInputProps) {
  const inputRef = useRef<RNTextInput>(null);

  useBlurOnDismiss(inputRef);

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      onStartShouldSetResponder={() => true}>
      <View style={styles.wrapper}>
        <RNTextInput ref={inputRef} style={styles.input} {...rest} />
        {true && (
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <MaterialIcons color='#333' name='clear' size={16} />
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 5
  },
  input: {
    flexShrink: 1,
    marginRight: 10,
    paddingHorizontal: 5
  },
  wrapper: {
    borderColor: '#ddd',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    flexGrow: 1,
    height: INPUT_FIELD_HEIGHT,
    justifyContent: 'space-between'
  }
});
