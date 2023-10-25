import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { INPUT_FIELD_HEIGHT, TEXT_INPUT_STYLE } from 'src/constants';

import TextInput from './TextInput';

type NumberInputProps = {
  max?: number;
  min?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  step?: number;
  value?: number;
};

export default function NumberInput({
  max = 100,
  min = 0,
  onChange,
  placeholder,
  step = 1,
  value: valueProp
}: NumberInputProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [value, setValue] = useState<number | undefined>(undefined);

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  const handleChange = (text: string) => {
    clearTimeout(timeoutRef.current);
    const newValue = parseInt(text);
    const validatedValue = isNaN(newValue)
      ? undefined
      : Math.min(newValue, max);
    setValue(validatedValue);
    if (validatedValue === undefined || validatedValue >= min) {
      onChange(validatedValue);
    } else {
      timeoutRef.current = setTimeout(() => {
        onChange(Math.max(min, validatedValue));
      }, 500);
    }
  };

  const handleIncrement = () => {
    const newValue = Math.min(value ? value + step : min, max);
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value ? value - step : max, min);
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.button} onPress={handleDecrement}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <TextInput
        keyboardType='number-pad'
        placeholder={placeholder}
        style={TEXT_INPUT_STYLE}
        value={value?.toString()}
        onChangeText={handleChange}
      />
      <TouchableOpacity style={styles.button} onPress={handleIncrement}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    height: INPUT_FIELD_HEIGHT,
    justifyContent: 'center',
    width: INPUT_FIELD_HEIGHT
  },
  buttonText: {
    color: '#666',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontWeight: 'bold'
  },
  wrapper: {
    flexDirection: 'row',
    gap: 5,
    height: INPUT_FIELD_HEIGHT
  }
});
