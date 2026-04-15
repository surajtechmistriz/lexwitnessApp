import React, { useState, useEffect } from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';

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

  useEffect(() => {
    if (!isAuthLoading) {
      setAuthMode(isLoggedIn ? null : 'register');
    }
  }, [isLoggedIn, isAuthLoading]);

    //  FIX: hide splash when ready
  useEffect(() => {
    if (!isAuthLoading) {
      SplashScreen.hide();
    }
  }, [isAuthLoading]);

  //  SHOW SPLASH WHILE AUTH IS LOADING
  // if (isAuthLoading) {
  //   return <SplashScreen />;
  // }

  return (
    <NavigationContainer ref={navigationRef}>
      <Header onSearchPress={() => setIsSearchVisible(true)} />

      <AppDrawer />

      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />

      {!isAuthLoading && authMode && (
        <AuthPopup visible mode={authMode} setMode={setAuthMode} />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;