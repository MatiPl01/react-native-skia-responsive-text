import { StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { INPUT_FIELD_HEIGHT } from 'src/constants';

type SelectInputProps<V> = {
  items: Array<{ label: string; value: V }>;
  onChange: (value: V) => void;
  placeholder?: string;
  value: V;
};

export default function SelectInput<V extends string | undefined>({
  items,
  onChange,
  placeholder,
  value
}: SelectInputProps<V>) {
  return (
    <View style={styles.input}>
      <RNPickerSelect
        items={items}
        value={value}
        placeholder={{
          label: placeholder,
          value: undefined
        }}
        onValueChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: '#ddd',
    borderRadius: 10,
    borderWidth: 1,
    flexGrow: 1,
    height: INPUT_FIELD_HEIGHT
  }
});
