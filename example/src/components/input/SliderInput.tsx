import { Slider } from '@miblanchard/react-native-slider';
import { memo } from 'react';
import { SharedValue } from 'react-native-reanimated';

type SliderInputProps = {
  onComplete?: (value: number) => void;
  progress: SharedValue<number>;
};

function SliderInput({ onComplete, progress }: SliderInputProps) {
  return (
    <Slider
      onSlidingComplete={() => {
        onComplete?.(progress.value);
      }}
      onValueChange={values => {
        progress.value = values[0]!;
      }}
    />
  );
}

export default memo(SliderInput);
