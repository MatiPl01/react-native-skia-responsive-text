import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { INPUT_FIELD_HEIGHT } from 'src/constants';

import TextInput from './TextInput';

enum RepeatAction {
  Increment,
  Decrement
}

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

  const [repeatedAction, setRepeatedAction] = useState<RepeatAction | null>(
    null
  );

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

  const handleIncrement = useCallback(() => {
    setValue(oldValue => {
      const newValue = Math.min(
        !isNaN(oldValue as number) ? (oldValue as number) + step : min,
        max
      );
      onChange?.(newValue);
      return newValue;
    });
  }, [onChange]);

  const handleDecrement = useCallback(() => {
    setValue(oldValue => {
      const newValue = Math.max(
        !isNaN(oldValue as number) ? (oldValue as number) - step : max,
        min
      );
      onChange?.(newValue);
      return newValue;
    });
  }, [onChange]);

  useEffect(() => {
    if (repeatedAction === null) return;
    const interval = setInterval(
      repeatedAction === RepeatAction.Decrement
        ? handleDecrement
        : handleIncrement,
      100
    );
    return () => clearInterval(interval);
  }, [repeatedAction, handleDecrement, handleIncrement]);

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        disabled={value === min}
        style={[styles.button, { opacity: value === min ? 0.5 : 1 }]}
        onLongPress={() => setRepeatedAction(RepeatAction.Decrement)}
        onPress={handleDecrement}
        onPressOut={() => setRepeatedAction(null)}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <View style={styles.inputWrapper}>
        <TextInput
          keyboardType='number-pad'
          placeholder={placeholder}
          value={value?.toString()}
          onChangeText={handleChange}
          onClear={() => handleChange('')}
          onFocus={() => setRepeatedAction(null)}
        />
      </View>
      <TouchableOpacity
        disabled={value === max}
        style={[styles.button, { opacity: value === max ? 0.5 : 1 }]}
        onLongPress={() => setRepeatedAction(RepeatAction.Increment)}
        onPress={handleIncrement}
        onPressOut={() => setRepeatedAction(null)}>
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
  inputWrapper: {
    flexGrow: 1,
    flexShrink: 1
  },
  wrapper: {
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    gap: 5,
    height: INPUT_FIELD_HEIGHT
  }
});
