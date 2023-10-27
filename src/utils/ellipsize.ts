import { SkFont } from '@shopify/react-native-skia';

import { ELLIPSIS } from '../constants';
import { TextLineData } from '../types';

export const trimLineStart = (
  line: TextLineData,
  font: SkFont,
  width: number,
  prefix = ELLIPSIS
): TextLineData => {
  // If the line is too short, return it as is
  if (line.width <= width) {
    return line;
  }

  // Go from the first char and find how many chars must be sliced to
  // display ellipsis at the beginning
  let firstIndex = 0;
  let lineWidth = font.getTextWidth(line.text) + font.getTextWidth(prefix);

  while (lineWidth > width && firstIndex < line.text.length) {
    lineWidth -= font.getTextWidth(line.text[firstIndex]!);
    firstIndex++;
  }

  const text = `${prefix}${line.text.slice(firstIndex).trimStart()}`;

  return {
    text,
    width: font.getTextWidth(text)
  };
};

export const trimLineEnd = (
  line: TextLineData,
  font: SkFont,
  width: number,
  suffix = ELLIPSIS
): TextLineData => {
  // If the line is too short, return it as is
  if (line.width <= width) {
    return line;
  }

  // Go from the last char and find how many chars must be sliced to
  // display ellipsis at the end or clip the end of the line
  let lastIndex = line.text.length - 1;
  let lineWidth = font.getTextWidth(line.text) + font.getTextWidth(suffix);

  while (lineWidth > width && lastIndex >= 0) {
    lineWidth -= font.getTextWidth(line.text[lastIndex]!);
    lastIndex--;
  }

  const text = `${line.text.slice(0, lastIndex + 1).trimEnd()}${suffix}`;

  return {
    text,
    width: font.getTextWidth(text)
  };
};

export const trimLineCenter = (
  line: TextLineData,
  font: SkFont,
  width: number,
  infix = ELLIPSIS
): TextLineData => {
  // If the line is too short, return it as is
  if (line.width <= width) {
    return line;
  }

  // Get first half of the line in terms of width
  let firstHalfWidth = 0;
  let firstHalfIndex = 0;

  while (firstHalfWidth < line.width / 2) {
    firstHalfWidth += font.getTextWidth(line.text[firstHalfIndex]!);
    firstHalfIndex++;
  }

  // Get second half of the line in terms of width
  let secondHalfWidth = 0;
  let secondHalfIndex = line.text.length - 1;

  while (secondHalfWidth < line.width / 2) {
    secondHalfWidth += font.getTextWidth(line.text[secondHalfIndex]!);
    secondHalfIndex--;
  }

  // Remove chars from the end of the first half and from the start of the second half
  // until the line width with infix is less than or equal to the width
  let lineWidth = firstHalfWidth + secondHalfWidth + font.getTextWidth(infix);
  while (lineWidth > width) {
    if (firstHalfWidth > secondHalfWidth) {
      firstHalfWidth -= font.getTextWidth(line.text[--firstHalfIndex]!);
    } else {
      secondHalfWidth -= font.getTextWidth(line.text[++secondHalfIndex]!);
    }
    lineWidth = firstHalfWidth + secondHalfWidth + font.getTextWidth(infix);
  }

  const text = `${line.text
    .slice(0, firstHalfIndex)
    .trimEnd()}${infix}${line.text.slice(secondHalfIndex).trimStart()}`;

  return {
    text,
    width: font.getTextWidth(text)
  };
};
