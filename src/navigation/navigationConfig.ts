// navigation/navigationConfig.ts
import { ThemeColors } from '../types/theme';
import { Platform } from 'react-native';

export const defaultStackOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  gestureEnabled: true,
  animationDuration: 300,
};

export const getTabScreenOptions = (
  colors: ThemeColors,
  isDark: boolean,
  bottomInset: number,
  isTablet: boolean,
) => ({
  headerShown: false,

  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: isDark ? colors.textMuted : '#999',

  tabBarStyle: {
    height: isTablet ? 60 : 55,
    paddingBottom: isTablet ? 6 : 4,
    paddingTop: isTablet ? 6 : 4,
    borderTopWidth: 0,
    elevation: 10,
    backgroundColor: colors.background,
    
    //  Add Android specific handling
    ...(Platform.OS === 'android' && {
      paddingBottom: (isTablet ? 6 : 4) + bottomInset,
    }),
    
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: isDark ? 0.3 : 0.08,
    shadowRadius: 8,
  },

  tabBarLabelStyle: {
    fontSize: isTablet ? 12 : 10,
    fontWeight: '600',
    marginBottom: isTablet ? 2 : 1,
    color: isDark ? colors.text : undefined,
  },

  tabBarHideOnKeyboard: true,
});

export const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: '#c9060a',
  tabBarInactiveTintColor: '#999',
  tabBarStyle: {
    height: 55,
    paddingBottom: 4,
    paddingTop: 4,
    borderTopWidth: 0,
    elevation: 10,
    backgroundColor: '#ffffff',
  },
  tabBarLabelStyle: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 1,
  },
  tabBarHideOnKeyboard: true,
};