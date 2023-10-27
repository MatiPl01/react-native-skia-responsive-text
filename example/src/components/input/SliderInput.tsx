import { Slider } from '@miblanchard/react-native-slider';
import { memo } from 'react';
import { SharedValue } from 'react-native-reanimated';

type SliderInputProps = {
  onComplete?: (value: number) => void;
  progress: SharedValue<number>;
  value: number;
};

function SliderInput({ onComplete, progress, value }: SliderInputProps) {
  return (
    <Slider
      value={value}
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
