import { useTheme } from '../redux/useTheme';

export const defaultStackOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  gestureEnabled: true,
  animationDuration: 300,
};

// Function to get tab screen options with theme
export const getTabScreenOptions = (colors: any, isDark: boolean) => ({
  headerShown: false,
  tabBarActiveTintColor: colors.primary || '#c9060a',
  tabBarInactiveTintColor: isDark ? colors.textMuted : '#999',
  tabBarStyle: {
    height: 62,
    paddingBottom: 6,
    paddingTop: 6,
    borderTopWidth: isDark ? 1 : 0,
    borderTopColor: isDark ? colors.border : 'transparent',
    elevation: 10,
    backgroundColor: colors.card || '#ffffff',
    shadowColor: isDark ? '#000' : '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 8,
  },
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
    color: isDark ? colors.text : undefined,
  },
  tabBarHideOnKeyboard: true,
});

// Default export for backward compatibility
export const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: '#c9060a',
  tabBarInactiveTintColor: '#999',
  tabBarStyle: {
    height: 62,
    paddingBottom: 6,
    paddingTop: 6,
    borderTopWidth: 0,
    elevation: 10,
    backgroundColor: '#ffffff',
  },
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  tabBarHideOnKeyboard: true,
};