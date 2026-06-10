import React, { useEffect, useState } from 'react';

import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';

import Animated, {
  FadeIn,
} from 'react-native-reanimated';

import SplashScreen from 'react-native-splash-screen';

import GlobalPopup from '../modal/GlobalPopup';
import RootStack from './RootStack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const navigationRef =
  createNavigationContainerRef();

const AppNavigator = () => {
  const [isAppReady, setIsAppReady] =
    useState(false);

const darkMode = useSelector(
  (state: RootState) => state.theme.mode === 'dark'
);

  useEffect(() => {
    // ✅ FAST APP START
    setIsAppReady(true);

    // ✅ HIDE SPLASH QUICKLY
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      style={{ flex: 1 }}
    >
      <NavigationContainer
  ref={navigationRef}
  theme={darkMode ? DarkTheme : DefaultTheme}
>
        <RootStack />

        <GlobalPopup />
      </NavigationContainer>
    </Animated.View>
  );
};

export default AppNavigator;