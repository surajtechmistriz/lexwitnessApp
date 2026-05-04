import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Subscription from '../screens/auth/screens/Subscription';
import MagazinesScreen from '../screens/magazines/MagazinesScreen';
import SignIn from '../screens/auth/screens/SignIn';
import Register from '../screens/auth/screens/Register';

import CustomDrawer from '../components/common/CustomDrawer';
import BottomTabs from './BottomTabs';

// ✅ GLOBAL UI
import Header from '../components/common/Header';
import SearchOverlay from '../components/common/SearchOverlay';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          // ✅ GLOBAL HEADER FOR ALL SCREENS
          header: () => (
            <Header onSearchPress={() => setIsSearchVisible(true)} />
          ),
        }}
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        {/* Main App */}
        <Drawer.Screen name="Home" component={BottomTabs} />

        {/* Other Screens */}
        <Drawer.Screen name="Subscription" component={Subscription} />
        {/* <Drawer.Screen name="Magazines" component={MagazinesScreen} /> */}

        {/* Auth */}
        <Drawer.Screen name="SignIn" component={SignIn} />
        <Drawer.Screen name="Register" component={Register} />
      </Drawer.Navigator>

      {/* ✅ GLOBAL SEARCH */}
      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />
    </>
  );
}