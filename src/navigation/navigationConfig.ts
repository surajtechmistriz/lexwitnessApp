export const defaultStackOptions = {
  headerShown: false,

  // ✅ smoother + lighter animation
  animation: 'slide_from_right' as const,

  // ✅ fixes drawer/stack gesture conflicts
  gestureEnabled: false,

  // ✅ keep disabled on Android
  fullScreenGestureEnabled: false,

  // ✅ faster native feel
  animationDuration: 180,

  // ✅ better rendering performance
  freezeOnBlur: false,

  contentStyle: {
    backgroundColor: '#ffffff',
  },
};