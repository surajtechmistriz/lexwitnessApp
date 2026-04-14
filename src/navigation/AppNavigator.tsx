import React, { useState, useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';

import AppDrawer from '../components/drawer/AppDrawer';
import Header from '../components/common/Header';
import SearchOverlay from '../components/common/SearchOverlay';
import AuthPopup from '../modal/AuthPopup';

import AuthorScreen from '../features/author/AuthorScreen';
import ArticleDetailPage from '../features/article/ArticleScreen';
import MagazineDetailScreen from '../features/magazines/MagazineDetailScreen';
import EditorialDetail from '../features/editorial/EditorialDetail';
import CategoryScreen from '../features/category/CategoryScreen';

export const navigationRef = createNavigationContainerRef();
const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();

  const [authMode, setAuthMode] = useState(
    isLoggedIn ? null : 'register',
  );
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    if (isLoggedIn) setAuthMode(null);
  }, [isLoggedIn]);

  return (
    <NavigationContainer ref={navigationRef}>

      <Header onSearchPress={() => setIsSearchVisible(true)} />

      <RootStack.Navigator screenOptions={{ headerShown: false }}>

        {/* MAIN APP (tabs/drawer inside) */}
        <RootStack.Screen name="AppMain" component={AppDrawer} />

        {/* GLOBAL SCREENS (always full screen) */}
        <RootStack.Screen name="ArticleDetail" component={ArticleDetailPage} />
        <RootStack.Screen name="AuthorScreen" component={AuthorScreen} />
        <RootStack.Screen name="MagazineDetail" component={MagazineDetailScreen} />
        <RootStack.Screen name="EditorialDetail" component={EditorialDetail} />
        <RootStack.Screen name="CategoryScreen" component={CategoryScreen} />

      </RootStack.Navigator>

      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />

      {authMode && (
        <AuthPopup visible mode={authMode} setMode={setAuthMode} />
      )}

    </NavigationContainer>
  );
};

export default AppNavigator;