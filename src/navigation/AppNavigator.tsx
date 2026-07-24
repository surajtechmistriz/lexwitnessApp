import React, { useEffect, useState } from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { Alert, BackHandler } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import SplashScreen from 'react-native-splash-screen';
import { useSelector } from 'react-redux';

import RootStack from './RootStack';
import GlobalPopup from '../modal/GlobalPopup';
import ExitModal from '../components/common/ExitModal';

export const navigationRef = createNavigationContainerRef();

const AppNavigator = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const darkMode = useSelector(
    (state: any) => state.theme.mode === 'dark',
  );

  // Splash
  useEffect(() => {
    setIsAppReady(true);

    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Global Android Back Handler
  useEffect(() => {
    const onBackPress = () => {
      if (!navigationRef.isReady()) {
        return false;
      }

      const route = navigationRef.getCurrentRoute();

      console.log('Current Route =>', route);

      // Change this if your Home screen name is different
      if (route?.name === 'HomeTab') {
        setShowExitModal(true);
return true;
      }

      // Let React Navigation handle the back press
      return false;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => subscription.remove();
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
          <ExitModal
    visible={showExitModal}
    onClose={() => setShowExitModal(false)}
  />
      </NavigationContainer>
    </Animated.View>
  );
};

export default AppNavigator;