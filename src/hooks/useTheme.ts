import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useTheme = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);

  const isDark = mode === 'dark';

  const colors = {
    background: isDark ? '#0f172a' : '#ffffff',
    card: isDark ? '#1e293b' : '#ffffff',
    surface: isDark ? '#111827' : '#f9fafb',

    text: isDark ? '#f8fafc' : '#111827',
    subText: isDark ? '#94a3b8' : '#6b7280',
    muted: isDark ? '#64748b' : '#9ca3af',

    border: isDark ? '#334155' : '#e5e7eb',

    primary: '#c9060a',
    primaryLight: '#ef4444',

    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',

    icon: isDark ? '#e2e8f0' : '#374151',
    placeholder: isDark ? '#64748b' : '#9ca3af',

    shadow: isDark ? '#000000' : '#000000',
  };

  return {
    mode,
    isDark,
    colors,
  };
};