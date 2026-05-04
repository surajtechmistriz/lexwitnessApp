import React, { useEffect, useRef, useState } from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { Animated } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import DrawerNavigator from './DrawerNavigator';
import GlobalPopup from '../modal/GlobalPopup';

export const navigationRef = createNavigationContainerRef();

const AppNavigator = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const prepare = async () => {
      setIsAppReady(true);
      setTimeout(() => SplashScreen.hide(), 250);
    };
    prepare();
  }, []);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isAppReady]);

  if (!isAppReady) return null;

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <NavigationContainer ref={navigationRef}>
        <DrawerNavigator />
      </NavigationContainer>

      {/* Global things only */}
      <GlobalPopup />
    </Animated.View>
  );
};

export default AppNavigator;