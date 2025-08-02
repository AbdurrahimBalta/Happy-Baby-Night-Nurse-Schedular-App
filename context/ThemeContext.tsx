import React, { createContext, useContext, useState } from 'react';
import { COLORS } from '@/constants/Colors';

type Theme = {
  colors: typeof COLORS;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<Theme>({
  colors: COLORS,
  isDarkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, we would switch the color values here
  };

  const value = {
    colors: COLORS,
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);