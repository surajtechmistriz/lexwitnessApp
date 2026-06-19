import React, { createContext, useContext, useState, useMemo } from 'react';
import { Colors } from '../constants/colors';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof Colors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // You can extend this for dark mode colors
  const colors = useMemo(() => {
    if (theme === 'dark') {
      return {
        ...Colors,
        background: '#1a1a1a',
        cardBackground: '#2d2d2d',
        text: {
          ...Colors.text,
          primary: '#ffffff',
          secondary: '#9ca3af',
        },
        // ... override other colors for dark mode
      };
    }
    return Colors;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};