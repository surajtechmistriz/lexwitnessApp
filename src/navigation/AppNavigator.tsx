import React from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import Register from '../features/auth/screens/Register';
import SignInScreen from '../features/auth/screens/SignIn';
import SubscriptionPage from '../features/auth/screens/Subscription';
import MagazinesScreen from '../features/magazines/MagazinesScreen';

// Components
import Header from '../components/common/Header';
import SearchOverlay from '../components/common/SearchOverlay';
import RegisterPopup from '../modal/RegisterPopup';
import AppDrawer from '../components/drawer/AppDrawer';
import CategoryScreen from '../features/category/CategoryScreen';
import ArchiveScreen from '../features/archive/ArchiveScreen';

// Stack definition
export const navigationRef = createNavigationContainerRef();
const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);

  return (
    <NavigationContainer ref={navigationRef}>
      <Header onSearchPress={() => setIsSearchVisible(true)} />
      
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Main App (Drawer & Tabs) */}
        <RootStack.Screen name="AppMain" component={AppDrawer} />

        {/* Global Screens - Now reachable from anywhere directly! */}
        <RootStack.Screen name="CategoryScreen" component={CategoryScreen} />
        <RootStack.Screen name="SignIn" component={SignInScreen} />
        <RootStack.Screen name="Register" component={Register} />
        <RootStack.Screen name="Subscription" component={SubscriptionPage} />
        <RootStack.Screen name="Magazines" component={MagazinesScreen} />
        <RootStack.Screen name="Archive" component={ArchiveScreen} />
      </RootStack.Navigator>

      <SearchOverlay visible={isSearchVisible} onClose={() => setIsSearchVisible(false)} />
      <RegisterPopup />
    </NavigationContainer>
  );
};

export default AppNavigator;