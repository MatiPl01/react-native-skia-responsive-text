/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SkFont } from '@shopify/react-native-skia';

import { EllipsizeMode, TextLineData } from '../types';

const ELLIPSIS = '...';

const isSpace = (text: string): boolean => text.trim().length === 0;

export const getTextChunks = (text: string): Array<string> => {
  const splittedText = text.split(/(\s+)/g).filter(Boolean);
  const chunks: Array<string> = [];

  if (splittedText.length === 0) {
    return chunks;
  }

  const firstChunk = splittedText[0]!;
  let prefix = '';
  let i = 0;

  if (isSpace(firstChunk)) {
    prefix = firstChunk;
    i++;
  }

  for (; i < splittedText.length; i++) {
    const chunk = prefix + splittedText[i]!;
    prefix = '';
    const nextChunk = splittedText[i + 1];
    if (nextChunk && isSpace(nextChunk)) {
      chunks.push(chunk + nextChunk);
      i++;
    } else {
      chunks.push(chunk);
    }
  }

  return chunks;
};

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

  const addNewLine = () => {
    result.push({
      text: currentLine.chunks.join(''),
      width: currentLine.width
    });
    currentLine = { chunks: [], width: 0 };
  };

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]!;
    const chunkWidth = nextChunkWidth;
    const nextChunk = chunks[i + 1];
    nextChunkWidth = nextChunk ? font.getTextWidth(nextChunk) : Infinity;

    // If the chunk will fit in the text line, don't break it
    if (chunkWidth <= width) {
      // If the current chunk won't fit in the current line, add it to the next line
      if (currentLine.width + chunkWidth > width) {
        addNewLine();
      }
      // Add the chunk to the current line
      currentLine.chunks.push(chunk);
      currentLine.width += chunkWidth;
    }
    // Otherwise, if the chunk is a single word, break it
    else {
      let j = 0;
      let k = 1;
      let nextSliceWidth = font.getTextWidth(chunk.slice(j, k + 1));

      for (; k <= chunk.length; k++) {
        const slice = chunk.slice(j, k);
        if (currentLine.width + nextSliceWidth > width || k === chunk.length) {
          currentLine.chunks.push(slice);
          currentLine.width += font.getTextWidth(slice);
          if (k < chunk.length) addNewLine();
          j = k;
        }
        nextSliceWidth = font.getTextWidth(chunk.slice(j, k + 1));
      }
    }
  }

  // If the last line is not empty, add it to the result
  if (currentLine.chunks.length) {
    result.push({
      text: currentLine.chunks.join(''),
      width: currentLine.width
    });
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
  textChunks: Array<string>,
  font: SkFont,
  width: number,
  numberOfLines = Infinity,
  ellipsizeMode: EllipsizeMode = 'tail'
): Array<TextLineData> => {
  if (!textChunks.length) {
    return [];
  }

  if (numberOfLines === Infinity) {
    return wrapWithoutTrimming(textChunks, font, width);
  }

  return wrapWithTrimming(
    textChunks,
    font,
    width,
    numberOfLines,
    ellipsizeMode
  );
};
