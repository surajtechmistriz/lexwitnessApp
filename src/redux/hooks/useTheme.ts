import { useSelector, useDispatch } from 'react-redux';
import { setTheme, toggleTheme } from '../slices/themeSlice';
import { ThemeMode } from '../../types/theme';
import { RootState } from '../store';

/**
 * Custom hook for accessing and managing theme state
 * Uses Redux for state management
 */
export const useTheme = () => {
  const dispatch = useDispatch();
  const { mode, colors } = useSelector((state: RootState) => state.theme);
  const isDark = mode === 'dark';

  return {
    mode,
    colors,
    isDark,
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (theme: ThemeMode) => dispatch(setTheme(theme)),
  };
};