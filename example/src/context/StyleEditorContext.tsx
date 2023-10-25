import { createContext, useContext } from 'react';

type StyleEditorContextType = {};

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
  return (
    <StyleEditorContext.Provider value={{}}>
      {children}
    </StyleEditorContext.Provider>
  );
}
