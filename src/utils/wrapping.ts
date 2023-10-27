import { SkFont } from '@shopify/react-native-skia';

import { ELLIPSIS } from '../constants';
import { EllipsizeMode, TextLineData } from '../types';
import { trimLineCenter, trimLineEnd, trimLineStart } from './ellipsize';
import { mergeLines } from './text';

const wrapWithoutTrimmingFromStart = (
  chunks: Array<string>,
  font: SkFont,
  width: number,
  maxLines = Infinity
): Array<TextLineData> => {
  if (maxLines <= 0) return [];

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

  const shouldBreak = () => result.length === maxLines;

  for (let i = 0; i < chunks.length; i++) {
    if (shouldBreak()) break;
    const chunk = chunks[i]!;
    const chunkWidth = nextChunkWidth;
    const nextChunk = chunks[i + 1];
    nextChunkWidth = nextChunk ? font.getTextWidth(nextChunk) : Infinity;

    // If the chunk will fit in the text line, don't break it
    if (chunkWidth <= width) {
      // If the current chunk won't fit in the current line, add it to the next line
      if (currentLine.width + chunkWidth > width) {
        addNewLine();
        if (result.length === maxLines) {
          break;
        }
      }
      // Add the chunk to the current line
      currentLine.chunks.push(chunk);
      currentLine.width += chunkWidth;
    }
    // Otherwise, if the chunk is a single word, break it
    else {
      if (currentLine.chunks.length && result.length < maxLines - 1) {
        addNewLine();
      }

      let j = 0;
      let k = 1;
      let nextSliceWidth = font.getTextWidth(chunk.slice(j, k));

      for (; k <= chunk.length; k++) {
        const slice = chunk.slice(j, k);
        if (currentLine.width + nextSliceWidth > width || k === chunk.length) {
          currentLine.chunks.push(slice);
          currentLine.width += font.getTextWidth(slice);
          if (k < chunk.length) addNewLine();
          if (shouldBreak()) break;
          j = k;
        }
        nextSliceWidth = font.getTextWidth(chunk.slice(j, k + 1));
      }
    }
  }

  // If the last line is not empty, add it to the result
  if (currentLine.chunks.length && !shouldBreak()) {
    addNewLine();
  }

  return result;
};

const wrapWithoutTrimmingFromEnd = (
  chunks: Array<string>,
  font: SkFont,
  width: number,
  maxLines = Infinity
): Array<TextLineData> => {
  if (maxLines <= 0) return [];

  const result: Array<TextLineData> = [];
  let currentLine: { chunks: Array<string>; width: number } = {
    chunks: [],
    width: 0
  };
  let nextChunkWidth = font.getTextWidth(chunks[chunks.length - 1]!);

  const addNewLine = () => {
    result.push({
      text: currentLine.chunks.reverse().join(''),
      width: currentLine.width
    });
    currentLine = { chunks: [], width: 0 };
  };

  const shouldBreak = () => result.length === maxLines;

  for (let i = chunks.length - 1; i >= 0; i--) {
    if (shouldBreak()) break;
    const chunk = chunks[i]!;
    const chunkWidth = nextChunkWidth;
    const nextChunk = chunks[i - 1];
    nextChunkWidth = nextChunk ? font.getTextWidth(nextChunk) : Infinity;

    // If the chunk will fit in the text line, don't break it
    if (chunkWidth <= width) {
      // If the current chunk won't fit in the current line, add it to the next line
      if (chunkWidth + currentLine.width > width) {
        addNewLine();
        if (result.length === maxLines) {
          break;
        }
      }
      // Add the chunk to the current line
      currentLine.chunks.push(chunk);
      currentLine.width += chunkWidth;
    }
    // Otherwise, if the chunk is a single word, break it
    else {
      if (currentLine.chunks.length && result.length < maxLines - 1) {
        addNewLine();
      }

      let j = chunk.length;
      let k = j - 1;
      let nextSliceWidth = font.getTextWidth(chunk.slice(k, j));

      for (; k >= 0; k--) {
        const slice = chunk.slice(k, j);
        if (currentLine.width + nextSliceWidth > width || k === 0) {
          currentLine.chunks.push(slice);
          currentLine.width += font.getTextWidth(slice);
          if (k > 0) addNewLine();
          if (shouldBreak()) break;
          j = k;
        }
        nextSliceWidth = font.getTextWidth(chunk.slice(k - 1, j));
      }
    }
  }

  // If the last line is not empty, add it to the result
  if (currentLine.chunks.length && !shouldBreak()) {
    addNewLine();
  }

  return result.reverse();
};

const wrapWithTailTrimming = (
  chunks: Array<string>,
  font: SkFont,
  width: number,
  numberOfLines: number,
  suffix = ELLIPSIS
): Array<TextLineData> => {
  const withoutTrimming = wrapWithoutTrimmingFromStart(
    chunks,
    font,
    width,
    numberOfLines + 1
  );
  if (withoutTrimming.length <= numberOfLines) {
    return withoutTrimming;
  }

  return [
    ...withoutTrimming.slice(0, numberOfLines - 1),
    trimLineEnd(
      mergeLines(withoutTrimming.slice(numberOfLines - 1, numberOfLines + 1)),
      font,
      width,
      suffix
    )
  ];
};

const wrapWithClipTrimming = (
  chunks: Array<string>,
  font: SkFont,
  width: number,
  numberOfLines: number
): Array<TextLineData> =>
  wrapWithTailTrimming(chunks, font, width, numberOfLines, '');

const wrapWithHeadTrimming = (
  chunks: Array<string>,
  font: SkFont,
  width: number,
  numberOfLines: number
): Array<TextLineData> => {
  const withoutTrimming = wrapWithoutTrimmingFromEnd(
    chunks,
    font,
    width,
    numberOfLines + 1
  );
  // If trimming is not needed, return the result of wrapWithoutTrimmingFromStart
  // (to make it look more natural)
  if (withoutTrimming.length <= numberOfLines) {
    return wrapWithoutTrimmingFromStart(chunks, font, width, numberOfLines);
  }

  return [
    trimLineStart(mergeLines(withoutTrimming.slice(0, 2)), font, width),
    ...withoutTrimming.slice(2)
  ];
};

const wrapWithMiddleTrimming = (
  chunks: Array<string>,
  font: SkFont,
  width: number,
  numberOfLines: number
): Array<TextLineData> => {
  const withoutFromStart = wrapWithoutTrimmingFromStart(
    chunks,
    font,
    width,
    numberOfLines + 1
  );
  // If trimming is not needed, return the result of wrapWithoutTrimmingFromStart
  // (to make it look more natural)
  if (withoutFromStart.length <= numberOfLines) {
    return withoutFromStart;
  }

  const halfLines = Math.floor(numberOfLines / 2);

  const withoutFromEnd = wrapWithoutTrimmingFromEnd(
    chunks,
    font,
    width,
    halfLines + 1
  );

  console.log({
    halfLines,
    withoutFromEnd,
    withoutFromStart
  });

  if (numberOfLines % 2 === 0) {
    return [
      ...withoutFromStart.slice(0, halfLines - 1),
      trimLineEnd(
        mergeLines(withoutFromStart.slice(halfLines - 1, halfLines + 1)),
        font,
        width
      ),
      trimLineStart(mergeLines(withoutFromEnd.slice(0, 2)), font, width),
      ...withoutFromEnd.slice(2)
    ];
  }

  return [
    ...withoutFromStart.slice(0, halfLines),
    trimLineCenter(
      mergeLines([withoutFromStart[halfLines]!, withoutFromEnd[0]!]),
      font,
      width
    ),
    ...withoutFromEnd.slice(1)
  ];
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
    return wrapWithoutTrimmingFromStart(textChunks, font, width);
  }

  switch (ellipsizeMode) {
    case 'head':
      return wrapWithHeadTrimming(textChunks, font, width, numberOfLines);
    case 'clip':
      return wrapWithClipTrimming(textChunks, font, width, numberOfLines);
    case 'middle':
      return wrapWithMiddleTrimming(textChunks, font, width, numberOfLines);
    case 'tail':
    default:
      return wrapWithTailTrimming(textChunks, font, width, numberOfLines);
  }
};
