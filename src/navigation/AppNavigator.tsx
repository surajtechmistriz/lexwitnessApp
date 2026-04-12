import React, { useState, useEffect } from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Context
import { useAuth } from '../context/AuthContext';

// Main App
import AppDrawer from '../components/drawer/AppDrawer';

// Components
import Header from '../components/common/Header';
import SearchOverlay from '../components/common/SearchOverlay';
import AuthPopup from '../modal/AuthPopup';

// OPTIONAL (future-safe navigation)
import AuthorScreen from '../features/author/AuthorScreen';
import ArticleDetailPage from '../features/article/ArticleScreen';
import MagazineDetailScreen from '../features/magazines/MagazineDetailScreen';
import EditorialDetail from '../features/editorial/EditorialDetail';
import CategoryScreen from '../features/category/CategoryScreen';

export const navigationRef = createNavigationContainerRef();
const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();

  const [authMode, setAuthMode] = useState<'register' | 'signin' | null>(
    isLoggedIn ? null : 'register',
  );
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    if (isLoggedIn) setAuthMode(null);
  }, [isLoggedIn]);

  return (
    <NavigationContainer ref={navigationRef}>
      {/* HEADER */}
      <Header onSearchPress={() => setIsSearchVisible(true)} />

      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* MAIN APP */}
        <RootStack.Screen name="AppMain" component={AppDrawer} />

        {/* ✅ ADD THIS (IMPORTANT FIX) */}
        <RootStack.Screen name="AuthorScreen" component={AuthorScreen} />
        <RootStack.Screen name="ArticleDetail" component={ArticleDetailPage} />
        <RootStack.Screen
          name="MagazineDetail"
          component={MagazineDetailScreen}
        />
        <RootStack.Screen name="EditorialDetail" component={EditorialDetail} />

        <RootStack.Screen name="CategoryScreen" component={CategoryScreen} />
      </RootStack.Navigator>

      {/* SEARCH */}
      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />

      {/* AUTH POPUP */}
      {authMode && <AuthPopup visible mode={authMode} setMode={setAuthMode} />}
    </NavigationContainer>
  );
};

export default AppNavigator;
