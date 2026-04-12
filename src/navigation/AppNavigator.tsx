import React, { useState } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens & Context
import { useAuth } from '../context/AuthContext';
import AppDrawer from '../components/drawer/AppDrawer';

// Components
import Header from '../components/common/Header';
import SearchOverlay from '../components/common/SearchOverlay';
import AuthPopup from '../modal/AuthPopup';


export const navigationRef = createNavigationContainerRef();
const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();
  // Set to null when user is logged in to hide the popup
  const [authMode, setAuthMode] = useState<'register' | 'signin' | null>(isLoggedIn ? null : 'register');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Auto-hide popup if user logs in
  React.useEffect(() => {
    if (isLoggedIn) setAuthMode(null);
  }, [isLoggedIn]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Header onSearchPress={() => setIsSearchVisible(true)} />
      
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="AppMain" component={AppDrawer} />
      </RootStack.Navigator>

      <SearchOverlay visible={isSearchVisible} onClose={() => setIsSearchVisible(false)} />

    {/* Pass authMode directly. 
         !!authMode converts 'register'/'signin' to true, and null to false.
      */}
      {authMode && (
        <AuthPopup 
          visible={!!authMode} 
          mode={authMode} 
          setMode={setAuthMode} 
        />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;