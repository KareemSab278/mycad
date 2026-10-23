import { createContext, useContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

export type ColorSchemePreference = 'light' | 'dark' | null;

type ColorSchemeContextValue = {
  preference: ColorSchemePreference;
  setPreference: Dispatch<SetStateAction<ColorSchemePreference>>;
};

const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null);

export const ColorSchemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreference] = useState<ColorSchemePreference>(null);

  return (
    <ColorSchemeContext.Provider value={{ preference, setPreference }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useColorSchemePreference = () => {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error('useColorSchemePreference must be used within ColorSchemeProvider');
  }
  return context;
};
