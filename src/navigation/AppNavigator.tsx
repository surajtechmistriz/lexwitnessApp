import React, { useState, useEffect, useRef } from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { Animated } from 'react-native';

// UI
import Header from '../components/common/Header';
import SearchOverlay from '../components/common/SearchOverlay';
import SplashScreen from 'react-native-splash-screen';

// Drawer
import AppDrawer from './drawer/AppDrawer';
import GlobalPopup from '../modal/GlobalPopup';

export const navigationRef = createNavigationContainerRef();

const AppNavigator = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  //  Prepare app before showing UI
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Preload any critical data here if needed
      } catch (e) {
        console.log('Prepare error:', e);
      } finally {
        setIsAppReady(true);
        // smooth delay before hiding splash
        setTimeout(() => {
          SplashScreen.hide();
        }, 250);
      }
    };

    prepareApp();
  }, []);

  //  Fade-in animation once app is ready
  useEffect(() => {
    if (isAppReady) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [isAppReady]);

  // ❌ Block UI until ready (prevent flicker)
  if (!isAppReady) return null;

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <NavigationContainer ref={navigationRef}>
        {/* Global Header */}
        <Header onSearchPress={() => setIsSearchVisible(true)} />

        {/* Main Navigation Stack / Drawer */}
        <AppDrawer />

        {/* Global Search Overlay */}
        <SearchOverlay
          visible={isSearchVisible}
          onClose={() => setIsSearchVisible(false)}
        />

          <GlobalPopup />
      </NavigationContainer>
    </Animated.View>
  );
};

export default AppNavigator;