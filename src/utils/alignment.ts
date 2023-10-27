import { HorizontalAlignment, TextLineData, VerticalAlignment } from '../types';

export const getTextLinesAlignment = (
  lines: Array<TextLineData>,
  width: number,
  alignment: HorizontalAlignment = 'left'
): Array<number> => {
  'worklet';
  switch (alignment) {
    case 'right':
      return lines.map(line => width - line.width);
    case 'center':
      return lines.map(line => (width - line.width) / 2);
    case 'center-left':
    case 'center-right':
      const longestLineWidth = Math.max(...lines.map(line => line.width));
      return lines.map(line =>
        alignment === 'center-left'
          ? (width - longestLineWidth) / 2
          : (width + longestLineWidth) / 2 - line.width
      );
    case 'left':
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return lines.map(_ => 0);
  }
};

export const getVerticalAlignmentOffset = (
  componentHeight: number,
  parentHeight = 0,
  verticalAlignment: VerticalAlignment = 'top'
): number => {
  'worklet';
  if (componentHeight >= parentHeight) {
    return 0;
  }

  switch (verticalAlignment) {
    case 'top':
      return 0;
    case 'bottom':
      return parentHeight - componentHeight;
    case 'center':
      return (parentHeight - componentHeight) / 2;
  }
};
