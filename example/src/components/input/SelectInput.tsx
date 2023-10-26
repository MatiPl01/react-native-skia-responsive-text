import { StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { INPUT_FIELD_HEIGHT } from 'src/constants';

type SelectInputProps<V> = {
  onChange: (value: V) => void;
  options: Array<{ label: string; value: V }>;
  value: V;
};

export default function SelectInput<V extends string | undefined>({
  value
}: SelectInputProps<V>) {
  return (
    <RNPickerSelect
      value='football'
      items={[
        { label: 'Football', value: 'football' },
        { label: 'Baseball', value: 'baseball' },
        { label: 'Hockey', value: 'hockey' }
      ]}
      onValueChange={value => console.log(value)}></RNPickerSelect>
  );
}

const styles = StyleSheet.create({
  selectedText: {},
  wrapper: {
    borderColor: '#ddd',
    borderRadius: 10,
    borderWidth: 1,
    flexGrow: 1,
    height: INPUT_FIELD_HEIGHT
  }
});
