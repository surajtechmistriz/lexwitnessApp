// src/hooks/useTabBarHeight.ts
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useResponsive } from './useResponsive';

export const useTabBarHeight = () => {
  const { isTablet } = useResponsive();
  const insets = useSafeAreaInsets();
  
  const tabBarHeight = isTablet ? 60 : 55;
  const bottomPadding = Platform.OS === 'android' ? insets.bottom : 0;
  
  return tabBarHeight + bottomPadding;
};