// navigation/navigationConfig.js
export const defaultStackOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  gestureEnabled: true,
  animationDuration: 300,
};

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