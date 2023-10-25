import { createContext, useCallback, useContext, useState } from 'react';
import {
  EllipsizeMode,
  HorizontalAlignment,
  VerticalAlignment
} from 'react-native-skia-responsive-text';

const DEFAULT_TEXT =
  'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error magnam similique nemo!';

type StyleEditorContextType = {
  ellipsizeMode: EllipsizeMode | undefined;
  horizontalAlignment: HorizontalAlignment | undefined;
  lineHeight: number | undefined;
  numberOfLines: number | undefined;
  setEllipsizeMode: (ellipsizeMode: EllipsizeMode | undefined) => void;
  setHorizontalAlignment: (
    horizontalAlignment: HorizontalAlignment | undefined
  ) => void;
  setLineHeight: (lineHeight: number | undefined) => void;
  setNumberOfLines: (numberOfLines: number | undefined) => void;
  setText: (text: string | undefined) => void;
  setVerticalAlignment: (
    verticalAlignment: VerticalAlignment | undefined
  ) => void;
  text: string;
  verticalAlignment: VerticalAlignment | undefined;
};

const StyleEditorContext = createContext<StyleEditorContextType | null>(null);

export function useStyleEditorContext() {
  const context = useContext(StyleEditorContext);

  if (!context) {
    throw new Error(
      `StyleEditor compound components cannot be rendered outside the StyleEditor component`
    );
  }

  return context;
}

export function StyleEditorProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [ellipsizeMode, setEllipsizeMode] = useState<
    EllipsizeMode | undefined
  >();
  const [horizontalAlignment, setHorizontalAlignment] = useState<
    HorizontalAlignment | undefined
  >();
  const [lineHeight, setLineHeight] = useState<number | undefined>();
  const [numberOfLines, setNumberOfLines] = useState<number | undefined>();
  const [verticalAlignment, setVerticalAlignment] = useState<
    VerticalAlignment | undefined
  >();
  const [text, setText] = useState(DEFAULT_TEXT);

  const handleSetText = useCallback((newText: string | undefined) => {
    setText(newText ?? DEFAULT_TEXT);
  }, []);

  const contextValue: StyleEditorContextType = {
    ellipsizeMode,
    horizontalAlignment,
    lineHeight,
    numberOfLines,
    setEllipsizeMode,
    setHorizontalAlignment,
    setLineHeight,
    setNumberOfLines,
    setText: handleSetText,
    setVerticalAlignment,
    text,
    verticalAlignment
  };

  return (
    <StyleEditorContext.Provider value={contextValue}>
      {children}
    </StyleEditorContext.Provider>
  );
}
