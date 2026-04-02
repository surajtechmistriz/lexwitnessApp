// useTabBarAnimation.ts
import { useRef } from "react";
import { Animated } from "react-native";

export const useTabBarAnimation = () => {
  const translateY = useRef(new Animated.Value(0)).current;
  const isHidden = useRef(false);

  const hideTabBar = () => {
    if (isHidden.current) return;
    isHidden.current = true;

    Animated.timing(translateY, {
      toValue: 80,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const showTabBar = () => {
    if (!isHidden.current) return;
    isHidden.current = false;

    Animated.timing(translateY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return { translateY, hideTabBar, showTabBar };
};