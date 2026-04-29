import React, { useState, useEffect, useRef } from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { Animated } from 'react-native';

// Context
import { useAuth } from '../context/AuthContext';

// UI
import Header from '../components/common/Header';
import SearchOverlay from '../components/common/SearchOverlay';
import AuthPopup from '../modal/AuthPopup';
import SplashScreen from 'react-native-splash-screen';

// Drawer
import AppDrawer from './drawer/AppDrawer';

export const navigationRef = createNavigationContainerRef();

const AppNavigator = () => {
  const { isLoggedIn, isAuthLoading } = useAuth();

  const [authMode, setAuthMode] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [isAppReady, setIsAppReady] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;

  // 🔹 Handle auth mode
  useEffect(() => {
    if (!isAuthLoading) {
      setAuthMode(isLoggedIn ? null : 'register');
    }
  }, [isLoggedIn, isAuthLoading]);

  // 🔥 Prepare app before showing UI
  useEffect(() => {
    const prepareApp = async () => {
      if (isAuthLoading) return;

      try {
        // 👉 you can preload APIs here if needed
        // await Promise.all([getHeroPost(), getEditorPick()]);
      } catch (e) {
        console.log('Prepare error:', e);
      } finally {
        setIsAppReady(true);

        // smooth delay
        setTimeout(() => {
          SplashScreen.hide();
        }, 250);
      }
    };

    prepareApp();
  }, [isAuthLoading]);

  // 🔥 Fade-in animation
  useEffect(() => {
    if (isAppReady) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [isAppReady]);

  // ❌ Block UI until ready (no flicker)
  if (!isAppReady) return null;

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <NavigationContainer ref={navigationRef}>
        <Header onSearchPress={() => setIsSearchVisible(true)} />

        <AppDrawer />

        <SearchOverlay
          visible={isSearchVisible}
          onClose={() => setIsSearchVisible(false)}
        />

        {authMode && (
          <AuthPopup visible mode={authMode} setMode={setAuthMode} />
        )}
      </NavigationContainer>
    </Animated.View>
  );
};

export default AppNavigator;