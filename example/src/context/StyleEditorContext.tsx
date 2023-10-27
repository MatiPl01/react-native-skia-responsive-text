import { createContext, useCallback, useContext, useState } from 'react';
import {
  EllipsizeMode,
  HorizontalAlignment,
  VerticalAlignment
} from 'react-native-skia-responsive-text';
import { EASING } from 'src/constants';

const DEFAULT_TEXT =
  'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error magnam similique nemo!';

type StyleEditorContextType = {
  animationDuration: number | undefined;
  animationEasing: keyof typeof EASING | undefined;
  backgroundColor: string | undefined;
  color: string | undefined;
  ellipsizeMode: EllipsizeMode | undefined;
  height: number | undefined;
  horizontalAlignment: HorizontalAlignment | undefined;
  lineHeight: number | undefined;
  numberOfLines: number | undefined;
  setAnimationDuration: (animationDuration: number | undefined) => void;
  setAnimationEasing: (
    animationEasing: keyof typeof EASING | undefined
  ) => void;
  setBackgroundColor: (backgroundColor: string | undefined) => void;
  setColor: (color: string | undefined) => void;
  setEllipsizeMode: (ellipsizeMode: EllipsizeMode | undefined) => void;
  setHeight: (height: number | undefined) => void;
  setHorizontalAlignment: (
    horizontalAlignment: HorizontalAlignment | undefined
  ) => void;
  setLineHeight: (lineHeight: number | undefined) => void;
  setNumberOfLines: (numberOfLines: number | undefined) => void;
  setText: (text: string | undefined) => void;
  setVerticalAlignment: (
    verticalAlignment: VerticalAlignment | undefined
  ) => void;
  setWidth: (width: number | undefined) => void;
  text: string;
  verticalAlignment: VerticalAlignment | undefined;
  width: number | undefined;
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
  const [width, setWidth] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [animationDuration, setAnimationDuration] = useState<
    number | undefined
  >();
  const [animationEasing, setAnimationEasing] = useState<
    keyof typeof EASING | undefined
  >();
  const [color, setColor] = useState<string | undefined>();
  const [backgroundColor, setBackgroundColor] = useState<string | undefined>();

  const [text, setText] = useState(DEFAULT_TEXT);

  const handleSetText = useCallback((newText: string | undefined) => {
    setText(newText ?? DEFAULT_TEXT);
  }, []);

  const contextValue: StyleEditorContextType = {
    animationDuration,
    animationEasing,
    backgroundColor,
    color,
    ellipsizeMode,
    height,
    horizontalAlignment,
    lineHeight,
    numberOfLines,
    setAnimationDuration,
    setAnimationEasing,
    setBackgroundColor,
    setColor,
    setEllipsizeMode,
    setHeight,
    setHorizontalAlignment,
    setLineHeight,
    setNumberOfLines,
    setText: handleSetText,
    setVerticalAlignment,
    setWidth,
    text,
    verticalAlignment,
    width
  };

  return (
    <StyleEditorContext.Provider value={contextValue}>
      {children}
    </StyleEditorContext.Provider>
  );
}
