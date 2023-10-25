/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SkFont } from '@shopify/react-native-skia';

import { EllipsizeMode, TextLineData } from '../types';

const ELLIPSIS = '...';

const getTextChunks = (text: string): Array<string> =>
  text.split(/(\s+(?=\S))/g).filter(word => word.length > 0);

const isSpace = (text: string): boolean => text.trim().length === 0;

const wrapWithoutTrimming = (
  chunks: Array<string>,
  font: SkFont,
  width: number
): Array<TextLineData> => {
  const result: Array<TextLineData> = [];

  let currentLine: { chunks: Array<string>; width: number } = {
    chunks: [],
    width: 0
  };

  let nextChunkWidth = font.getTextWidth(chunks[0]!);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]!;
    const chunkWidth = nextChunkWidth;
    const nextChunk = chunks[i + 1];
    nextChunkWidth = nextChunk ? font.getTextWidth(nextChunk) : Infinity;

    if (currentLine.chunks.length || !isSpace(chunk)) {
      currentLine.chunks.push(chunk);
      currentLine.width += chunkWidth;
    }

    if (currentLine.width + nextChunkWidth >= width) {
      result.push({
        text: currentLine.chunks.join(''),
        width: currentLine.width
      });
      currentLine = { chunks: [], width: 0 };
    }
  }

  return result;
};

const trimLineEnd = (
  line: TextLineData,
  chunks: Array<string>,
  chunkIdx: number,
  font: SkFont,
  width: number,
  mode: 'clip' | 'tail'
): TextLineData => {
  const renderEllipsis = mode !== 'clip';
  const additionalWidth = renderEllipsis ? font.getTextWidth(ELLIPSIS) : 0;

  let lastLineText = line.text;
  if (++chunkIdx < chunks.length) {
    lastLineText += chunks[chunkIdx]!;
  }

  // Go from the last char and find how many chars must be sliced to
  // display ellipsis at the end or clip the end of the line
  let lastIndex = lastLineText.length - 1;
  let lineWidth = font.getTextWidth(lastLineText) + additionalWidth;

  while (lineWidth > width && lastIndex >= 0) {
    lineWidth -= font.getTextWidth(lastLineText[lastIndex]!);
    lastIndex--;
  }

  return {
    text: `${lastLineText.slice(0, lastIndex)}${
      renderEllipsis ? ELLIPSIS : ''
    }`,
    width: lineWidth
  };
};

const trimLineStart = (
  line: TextLineData,
  chunks: Array<string>,
  chunkIdx: number,
  font: SkFont,
  width: number
): TextLineData => {
  let lastLineText = line.text;
  if (++chunkIdx < chunks.length) {
    lastLineText += chunks[chunkIdx]!;
  }

  // Go from the first char and find how many chars must be sliced to
  // display ellipsis at the beginning
  let firstIndex = 0;
  let lineWidth = font.getTextWidth(lastLineText) + font.getTextWidth(ELLIPSIS);

  while (lineWidth > width && firstIndex < line.text.length) {
    lineWidth -= font.getTextWidth(lastLineText[firstIndex]!);
    firstIndex++;
  }

  return {
    text: `${ELLIPSIS}${lastLineText.slice(firstIndex)}`,
    width: lineWidth
  };
};

const trimLineCenter = (
  line: TextLineData,
  chunks: Array<string>,
  chunkIdx: number,
  font: SkFont,
  width: number
): TextLineData => {
  let lastLineText = line.text;
  if (++chunkIdx < chunks.length) {
    lastLineText += chunks[chunkIdx]!;
  }

  const middleIdx = Math.ceil(lastLineText.length / 2);
  let leftIdx = middleIdx;
  let rightIdx = middleIdx;
  let lineWidth = font.getTextWidth(lastLineText) + font.getTextWidth(ELLIPSIS);

  let selectedIdx = -1; // -1 - left, 1 - right
  while (lineWidth > width && leftIdx >= 0 && rightIdx < lastLineText.length) {
    if (selectedIdx === -1) {
      lineWidth -= font.getTextWidth(lastLineText[leftIdx]!);
      leftIdx--;
    } else {
      lineWidth -= font.getTextWidth(lastLineText[rightIdx]!);
      rightIdx++;
    }
    selectedIdx *= -1;
  }

  return {
    text: `${lastLineText.slice(0, leftIdx)}${ELLIPSIS}${lastLineText.slice(
      rightIdx
    )}`,
    width: lineWidth
  };
};

const wrapWithTrimming = (
  chunks: Array<string>,
  font: SkFont,
  width: number,
  numberOfLines: number,
  mode: EllipsizeMode
): Array<TextLineData> => {
  const result: Array<TextLineData> = [];

  let currentLine: { chunks: Array<string>; width: number } = {
    chunks: [],
    width: 0
  };

  let i = 0;
  let shouldTrim = false;
  let nextChunkWidth = font.getTextWidth(chunks[0]!);

  for (; i < chunks.length; i++) {
    const chunk = chunks[i]!;
    const chunkWidth = nextChunkWidth;
    const nextChunk = chunks[i + 1];
    nextChunkWidth = nextChunk ? font.getTextWidth(nextChunk) : Infinity;

    if (currentLine.chunks.length || !isSpace(chunk)) {
      currentLine.chunks.push(chunk);
      currentLine.width += chunkWidth;
    }

    if (currentLine.width + nextChunkWidth >= width) {
      result.push({
        text: currentLine.chunks.join(''),
        width: currentLine.width
      });
      // Break if the last displayed line is reached
      if (result.length === numberOfLines && nextChunkWidth < Infinity) {
        shouldTrim = true;
        break;
      }
      currentLine = { chunks: [], width: 0 };
    }
  }

  if (shouldTrim) {
    let lastLine = result[result.length - 1]!;
    switch (mode) {
      case 'clip':
      case 'tail':
        lastLine = trimLineEnd(lastLine, chunks, i, font, width, mode);
        break;
      case 'head':
        lastLine = trimLineStart(lastLine, chunks, i, font, width);
        break;
      case 'middle':
        lastLine = trimLineCenter(lastLine, chunks, i, font, width);
    }

    result[result.length - 1] = lastLine;
  }

  return result;
};

export const wrapText = (
  text: string,
  font: SkFont,
  width: number,
  numberOfLines = Infinity,
  ellipsizeMode: EllipsizeMode = 'tail'
): Array<TextLineData> => {
  const chunks = getTextChunks(text);

  if (!chunks.length) {
    return [];
  }

  if (numberOfLines === Infinity) {
    return wrapWithoutTrimming(chunks, font, width);
  }

  return wrapWithTrimming(chunks, font, width, numberOfLines, ellipsizeMode);
};
