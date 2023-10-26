import { RefObject, useEffect } from 'react';
import { Keyboard, TextInput } from 'react-native';

export default function useBlurOnDismiss(inputRef: RefObject<TextInput>) {
  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current?.blur();
    });

    return () => {
      subscription.remove();
    };
  }, [inputRef]);
}
