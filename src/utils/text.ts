import { TextLineData } from '../types';

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

export const mergeLines = (lines: Array<TextLineData>): TextLineData =>
  lines.reduce(
    (acc, line) => ({
      text: acc.text + line.text,
      width: acc.width + line.width
    }),
    { text: '', width: 0 }
  );
