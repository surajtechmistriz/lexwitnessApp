import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useTheme = () => {
  const { mode, colors } = useSelector((state: RootState) => state.theme);
  const isDark = mode === 'dark';
  
  return { mode, colors, isDark };
};